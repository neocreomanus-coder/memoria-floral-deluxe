import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  getAllProducts: vi.fn().mockResolvedValue([]),
  getEnabledProducts: vi.fn().mockResolvedValue([]),
  getFeaturedProducts: vi.fn().mockResolvedValue([]),
  getProductsBySection: vi.fn().mockResolvedValue([]),
  getProductById: vi.fn().mockResolvedValue(undefined),
  createProduct: vi.fn().mockResolvedValue({}),
  updateProduct: vi.fn().mockResolvedValue({}),
  deleteProduct: vi.fn().mockResolvedValue({}),
  getAllSales: vi.fn().mockResolvedValue([]),
  createSale: vi.fn().mockResolvedValue({}),
  getSalesSummary: vi.fn().mockResolvedValue({ daily: 0, weekly: 0, monthly: 0, dailyCount: 0, weeklyCount: 0, monthlyCount: 0 }),
  getWeeklySalesChart: vi.fn().mockResolvedValue([]),
  getMonthlySalesChart: vi.fn().mockResolvedValue([]),
  getGalleryImages: vi.fn().mockResolvedValue([]),
  getAllGalleryImages: vi.fn().mockResolvedValue([]),
  createGalleryImage: vi.fn().mockResolvedValue({}),
  deleteGalleryImage: vi.fn().mockResolvedValue({}),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test/image.jpg", url: "/manus-storage/test/image.jpg" }),
}));

function createAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@memoriafloral.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("Public product routes", () => {
  it("returns featured products for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.featured();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns products by section for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.bySection({ section: "coronas_funebres" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns all enabled products for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.all();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Public gallery routes", () => {
  it("returns gallery images for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.gallery.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Admin product routes", () => {
  it("lists all products for admin", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.products.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a product successfully", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.products.create({
      name: "Corona Blanca Esmeralda",
      price: 195000,
      section: "coronas_funebres",
      isEnabled: true,
      isOffer: false,
      isFeatured: false,
    });
    expect(result.success).toBe(true);
  });

  it("toggles product enabled status", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.products.toggleEnabled({ id: 1, isEnabled: false });
    expect(result.success).toBe(true);
  });

  it("deletes a product", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.products.delete({ id: 1 });
    expect(result.success).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const userCtx: TrpcContext = {
      ...createPublicCtx(),
      user: {
        id: 2, openId: "regular-user", email: "user@test.com", name: "User",
        loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
      },
    };
    const caller = appRouter.createCaller(userCtx);
    await expect(caller.admin.products.list()).rejects.toThrow();
  });
});

describe("Admin sales routes", () => {
  it("returns sales summary for admin", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.sales.summary();
    expect(result).toHaveProperty("daily");
    expect(result).toHaveProperty("weekly");
    expect(result).toHaveProperty("monthly");
  });

  it("creates a sale successfully", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.sales.create({
      productName: "Corona Blanca",
      quantity: 1,
      unitPrice: 195000,
    });
    expect(result.success).toBe(true);
  });

  it("returns weekly chart data", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.sales.weeklyChart();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Admin gallery routes", () => {
  it("lists all gallery images for admin", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.gallery.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a gallery image", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.admin.gallery.create({ imageUrl: "/manus-storage/test.jpg", title: "Test" });
    expect(result.success).toBe(true);
  });
});

describe("Auth routes", () => {
  it("returns null user for unauthenticated requests", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user data for authenticated requests", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.role).toBe("admin");
  });
});
