import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertBannerSchema, insertCategorySchema, insertSiteSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Categories
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const parsed = insertCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const category = await storage.createCategory(parsed.data);
    res.json(category);
  });

  // Products
  app.get("/api/products", async (req, res) => {
    const categoryId = req.query.categoryId as string;
    if (categoryId) {
      const products = await storage.getProductsByCategory(parseInt(categoryId));
      return res.json(products);
    }
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/featured", async (req, res) => {
    const products = await storage.getFeaturedProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const product = await storage.createProduct(parsed.data);
    res.json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.updateProduct(id, req.body);
    res.json(product);
  });

  // Banners
  app.get("/api/banners", async (req, res) => {
    const banners = await storage.getBanners();
    res.json(banners);
  });

  app.get("/api/banners/active", async (req, res) => {
    const banners = await storage.getActiveBanners();
    res.json(banners);
  });

  app.post("/api/banners", async (req, res) => {
    const parsed = insertBannerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const banner = await storage.createBanner(parsed.data);
    res.json(banner);
  });

  app.patch("/api/banners/:id/order", async (req, res) => {
    const id = parseInt(req.params.id);
    const order = req.body.order;
    const banner = await storage.updateBannerOrder(id, order);
    res.json(banner);
  });

  app.patch("/api/banners/:id/toggle", async (req, res) => {
    const id = parseInt(req.params.id);
    const banner = await storage.toggleBannerActive(id);
    res.json(banner);
  });

  // Site Settings
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getSiteSettings();
    if (!settings) {
      return res.json({
        logo: "/logo.svg",
        favicon: "/favicon.svg",
        companyName: "Elektronik & Beyaz Eşya",
        address: "İstanbul, Türkiye",
        phone: "+90 (212) 123 45 67",
        email: "info@example.com",
        whatsapp: "+90 555 123 45 67", // Adding a default WhatsApp number
        mapsEmbed: null,
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null,
        aboutUs: "Kaliteli beyaz eşya ve elektronik ürünleri uygun fiyatlarla sunuyoruz.",
        metaTitle: "Elektronik & Beyaz Eşya",
        metaDescription: "Kaliteli beyaz eşya, televizyon ve küçük ev aletleri"
      });
    }
    res.json(settings);
  });

  app.post("/api/settings", async (req, res) => {
    const parsed = insertSiteSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const settings = await storage.updateSiteSettings(parsed.data);
    res.json(settings);
  });

  return httpServer;
}