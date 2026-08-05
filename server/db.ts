import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { gallery, InsertGallery, InsertProduct, InsertSale, products, sales, users } from "../drizzle/schema";
import type { InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ---- Products ----
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(products.sortOrder, desc(products.createdAt));
}

export async function getEnabledProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isEnabled, true)).orderBy(products.sortOrder, desc(products.createdAt));
}

export async function getProductsBySection(section: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(products)
    .where(and(eq(products.section, section as any), eq(products.isEnabled, true)))
    .orderBy(products.sortOrder, desc(products.createdAt));
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(products)
    .where(and(eq(products.isFeatured, true), eq(products.isEnabled, true)))
    .orderBy(products.sortOrder, desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(products).where(eq(products.id, id));
}

// ---- Sales ----
export async function createSale(data: InsertSale) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(sales).values(data);
}

export async function getSalesInRange(from: Date, to: Date) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(sales)
    .where(and(gte(sales.saleDate, from), lte(sales.saleDate, to)))
    .orderBy(desc(sales.saleDate));
}

export async function getAllSales() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sales).orderBy(desc(sales.saleDate));
}

export async function getSalesSummary() {
  const db = await getDb();
  if (!db) return { daily: 0, weekly: 0, monthly: 0, dailyCount: 0, weeklyCount: 0, monthlyCount: 0 };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [dailyRows, weeklyRows, monthlyRows] = await Promise.all([
    db.select({ total: sql<string>`SUM(totalPrice)`, count: sql<number>`COUNT(*)` }).from(sales).where(gte(sales.saleDate, startOfDay)),
    db.select({ total: sql<string>`SUM(totalPrice)`, count: sql<number>`COUNT(*)` }).from(sales).where(gte(sales.saleDate, startOfWeek)),
    db.select({ total: sql<string>`SUM(totalPrice)`, count: sql<number>`COUNT(*)` }).from(sales).where(gte(sales.saleDate, startOfMonth)),
  ]);

  return {
    daily: parseFloat(dailyRows[0]?.total ?? "0"),
    weekly: parseFloat(weeklyRows[0]?.total ?? "0"),
    monthly: parseFloat(monthlyRows[0]?.total ?? "0"),
    dailyCount: Number(dailyRows[0]?.count ?? 0),
    weeklyCount: Number(weeklyRows[0]?.count ?? 0),
    monthlyCount: Number(monthlyRows[0]?.count ?? 0),
  };
}

export async function getMonthlySalesChart() {
  const db = await getDb();
  if (!db) return [];
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const rows = await db
    .select({
      day: sql<string>`DATE(saleDate)`,
      total: sql<string>`SUM(totalPrice)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(sales)
    .where(gte(sales.saleDate, startOfMonth))
    .groupBy(sql`DATE(saleDate)`)
    .orderBy(sql`DATE(saleDate)`);

  return rows.map((r) => ({ day: r.day, total: parseFloat(r.total ?? "0"), count: Number(r.count) }));
}

export async function getWeeklySalesChart() {
  const db = await getDb();
  if (!db) return [];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const rows = await db
    .select({
      day: sql<string>`DATE(saleDate)`,
      total: sql<string>`SUM(totalPrice)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(sales)
    .where(gte(sales.saleDate, sevenDaysAgo))
    .groupBy(sql`DATE(saleDate)`)
    .orderBy(sql`DATE(saleDate)`);

  return rows.map((r) => ({ day: r.day, total: parseFloat(r.total ?? "0"), count: Number(r.count) }));
}

// ---- Gallery ----
export async function getGalleryImages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gallery).where(eq(gallery.isEnabled, true)).orderBy(gallery.sortOrder, desc(gallery.createdAt));
}

export async function getAllGalleryImages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gallery).orderBy(gallery.sortOrder, desc(gallery.createdAt));
}

export async function createGalleryImage(data: InsertGallery) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(gallery).values(data);
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(gallery).where(eq(gallery.id, id));
}
