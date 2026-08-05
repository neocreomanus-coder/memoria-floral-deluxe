import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createGalleryImage,
  createProduct,
  createSale,
  deleteGalleryImage,
  deleteProduct,
  getAllGalleryImages,
  getAllProducts,
  getAllSales,
  getEnabledProducts,
  getFeaturedProducts,
  getGalleryImages,
  getMonthlySalesChart,
  getProductById,
  getProductsBySection,
  getSalesSummary,
  getWeeklySalesChart,
  updateProduct,
} from "./db";
import { storagePut } from "./storage";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Solo administradores" });
  return next({ ctx });
});

const productInput = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  imageUrl: z.string().optional(),
  extraImages: z.array(z.string()).optional(),
  section: z.enum(["coronas_funebres", "sudarios", "rosas_inmortalizadas", "por_menos_200"]),
  description: z.string().optional(),
  includes: z.array(z.string()).optional(),
  isEnabled: z.boolean().optional(),
  isOffer: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ---- Public product routes ----
  products: router({
    featured: publicProcedure.query(() => getFeaturedProducts()),
    bySection: publicProcedure
      .input(z.object({ section: z.string() }))
      .query(({ input }) => getProductsBySection(input.section)),
    all: publicProcedure.query(() => getEnabledProducts()),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getProductById(input.id)),
  }),

  // ---- Public orders ----
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string().min(1),
        customerPhone: z.string().min(1),
        customerEmail: z.string().optional(),
        deliveryAddress: z.string().min(1),
        deliveryNeighborhood: z.string().optional(),
        deliveryDate: z.string().optional(),
        deliveryTime: z.string().optional(),
        dedicatoria: z.string().optional(),
        items: z.string(), // JSON
        subtotal: z.number(),
        total: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { orders } = await import("../drizzle/schema");
        await db.insert(orders).values({
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          deliveryAddress: input.deliveryAddress,
          deliveryNeighborhood: input.deliveryNeighborhood,
          deliveryDate: input.deliveryDate,
          deliveryTime: input.deliveryTime,
          dedicatoria: input.dedicatoria,
          items: input.items,
          subtotal: String(input.subtotal),
          total: String(input.total),
          notes: input.notes,
        });
        return { success: true };
      }),
  }),

  // ---- Admin orders ----

  // ---- Public gallery ----
  gallery: router({
    list: publicProcedure.query(() => getGalleryImages()),
  }),

  // ---- Admin routes ----
  admin: router({
    // Products management
    products: router({
      list: adminProcedure.query(() => getAllProducts()),
      create: adminProcedure.input(productInput).mutation(async ({ input }) => {
        await createProduct({
          name: input.name,
          price: String(input.price),
          originalPrice: input.originalPrice ? String(input.originalPrice) : undefined,
          imageUrl: input.imageUrl,
          section: input.section,
          description: input.description,
          isEnabled: input.isEnabled ?? true,
          isOffer: input.isOffer ?? false,
          isFeatured: input.isFeatured ?? false,
          sortOrder: input.sortOrder ?? 0,
        });
        return { success: true };
      }),
      update: adminProcedure
        .input(z.object({ id: z.number(), data: productInput.partial() }))
        .mutation(async ({ input }) => {
          const updateData: Record<string, unknown> = {};
          if (input.data.name !== undefined) updateData.name = input.data.name;
          if (input.data.price !== undefined) updateData.price = String(input.data.price);
          if (input.data.originalPrice !== undefined) updateData.originalPrice = String(input.data.originalPrice);
          if (input.data.imageUrl !== undefined) updateData.imageUrl = input.data.imageUrl;
          if (input.data.section !== undefined) updateData.section = input.data.section;
          if (input.data.description !== undefined) updateData.description = input.data.description;
          if (input.data.isEnabled !== undefined) updateData.isEnabled = input.data.isEnabled;
          if (input.data.isOffer !== undefined) updateData.isOffer = input.data.isOffer;
          if (input.data.isFeatured !== undefined) updateData.isFeatured = input.data.isFeatured;
          if (input.data.sortOrder !== undefined) updateData.sortOrder = input.data.sortOrder;
          await updateProduct(input.id, updateData as any);
          return { success: true };
        }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await deleteProduct(input.id);
        return { success: true };
      }),
      toggleEnabled: adminProcedure
        .input(z.object({ id: z.number(), isEnabled: z.boolean() }))
        .mutation(async ({ input }) => {
          await updateProduct(input.id, { isEnabled: input.isEnabled });
          return { success: true };
        }),
    }),

    // Sales management
    sales: router({
      list: adminProcedure.query(() => getAllSales()),
      summary: adminProcedure.query(() => getSalesSummary()),
      weeklyChart: adminProcedure.query(() => getWeeklySalesChart()),
      monthlyChart: adminProcedure.query(() => getMonthlySalesChart()),
      create: adminProcedure
        .input(
          z.object({
            productId: z.number().optional(),
            productName: z.string().min(1),
            quantity: z.number().int().positive(),
            unitPrice: z.number().positive(),
            notes: z.string().optional(),
            saleDate: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const total = input.quantity * input.unitPrice;
          await createSale({
            productId: input.productId,
            productName: input.productName,
            quantity: input.quantity,
            unitPrice: String(input.unitPrice),
            totalPrice: String(total),
            notes: input.notes,
            saleDate: input.saleDate ? new Date(input.saleDate) : new Date(),
          });
          return { success: true };
        }),
    }),

    // Gallery management
    gallery: router({
      list: adminProcedure.query(() => getAllGalleryImages()),
      create: adminProcedure
        .input(z.object({ imageUrl: z.string(), title: z.string().optional(), sortOrder: z.number().optional() }))
        .mutation(async ({ input }) => {
          await createGalleryImage({ imageUrl: input.imageUrl, title: input.title, sortOrder: input.sortOrder ?? 0 });
          return { success: true };
        }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await deleteGalleryImage(input.id);
        return { success: true };
      }),
    }),

    // Orders management
    orders: router({
      list: adminProcedure.query(async () => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) return [];
        const { orders } = await import("../drizzle/schema");
        const { desc } = await import("drizzle-orm");
        return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);
      }),
      updateStatus: adminProcedure
        .input(z.object({ id: z.number(), status: z.enum(["pending","confirmed","delivered","cancelled"]) }))
        .mutation(async ({ input }) => {
          const db = await import("./db").then(m => m.getDb());
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          const { orders } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
          return { success: true };
        }),
      accounting: adminProcedure.query(async () => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) return { totalDelivered: 0, totalOrders: 0, totalCancelled: 0, deliveredOrders: [], summary: {} };
        const { orders } = await import("../drizzle/schema");
        const { desc } = await import("drizzle-orm");
        const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
        const deliveredOrders = allOrders.filter(o => o.status === "delivered");
        const cancelledOrders = allOrders.filter(o => o.status === "cancelled");
        const totalDelivered = deliveredOrders.reduce((sum, o) => sum + parseFloat(String(o.total || 0)), 0);
        const totalCancelled = cancelledOrders.reduce((sum, o) => sum + parseFloat(String(o.total || 0)), 0);
        const summary: Record<string, { count: number; total: number }> = {};
        deliveredOrders.forEach(o => {
          const date = new Date(o.createdAt).toLocaleDateString("es-CO");
          if (!summary[date]) summary[date] = { count: 0, total: 0 };
          summary[date].count += 1;
          summary[date].total += parseFloat(String(o.total || 0));
        });
                return { totalDelivered, totalCancelled, totalOrders: allOrders.length, deliveredCount: deliveredOrders.length, cancelledCount: cancelledOrders.length, deliveredOrders: deliveredOrders.slice(0, 50), summary };
      }),
    }),

    // Image upload
    uploadImage: adminProcedure
      .input(z.object({ base64: z.string(), filename: z.string(), mimeType: z.string() }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        // Sanitize filename: remove accents, spaces and special chars
        const ext = input.filename.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const safeExt = ['jpg','jpeg','png','webp','gif'].includes(ext) ? ext : 'jpg';
        const key = `products/${Date.now()}.${safeExt}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
