import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Secciones de arreglos fúnebres
export const PRODUCT_SECTIONS = [
  "coronas_funebres",
  "sudarios",
  "rosas_inmortalizadas",
  "por_menos_200",
] as const;

export type ProductSection = (typeof PRODUCT_SECTIONS)[number];

export const SECTION_LABELS: Record<ProductSection, { subtitle: string; title: string; description: string }> = {
  coronas_funebres: {
    subtitle: "Honra La Memoria Con",
    title: "Coronas Fúnebres",
    description: "Expresa tu amor eterno con nuestras coronas funerarias. Flores que simbolizan pureza y amor perdurable.",
  },
  sudarios: {
    subtitle: "Un Último Tributo Con",
    title: "Sudarios",
    description: "Arreglos florales diseñados para acompañar en los momentos más solemnes con dignidad y belleza.",
  },
  rosas_inmortalizadas: {
    subtitle: "Un Recuerdo Eterno Con",
    title: "Rosas Inmortalizadas",
    description: "Rosas preservadas que permanecen hermosas para siempre, un símbolo eterno de amor y memoria.",
  },
  por_menos_200: {
    subtitle: "Arreglos Especiales",
    title: "Por Menos de $200.000",
    description: "Hermosos arreglos fúnebres con la misma calidad y amor, pensados para acompañarte en todo momento.",
  },
};

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  originalPrice: decimal("originalPrice", { precision: 12, scale: 2 }),
  imageUrl: text("imageUrl"),
  extraImages: text("extraImages"),
  section: mysqlEnum("section", PRODUCT_SECTIONS).notNull(),
  description: text("description"),
  includes: text("includes"),
  isEnabled: boolean("isEnabled").default(true).notNull(),
  isOffer: boolean("isOffer").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  saleDate: timestamp("saleDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 64 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  deliveryAddress: text("deliveryAddress").notNull(),
  deliveryNeighborhood: varchar("deliveryNeighborhood", { length: 255 }),
  deliveryDate: varchar("deliveryDate", { length: 64 }),
  deliveryTime: varchar("deliveryTime", { length: 64 }),
  dedicatoria: text("dedicatoria"),
  items: text("items").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "delivered", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  title: varchar("title", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isEnabled: boolean("isEnabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Gallery = typeof gallery.$inferSelect;
export type InsertGallery = typeof gallery.$inferInsert;
