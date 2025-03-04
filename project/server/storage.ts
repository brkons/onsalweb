import { 
  Category, InsertCategory,
  Product, InsertProduct,
  Banner, InsertBanner,
  SiteSettings, InsertSiteSettings
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getSubCategories(parentId: number): Promise<Category[]>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;

  // Banners  
  getBanners(): Promise<Banner[]>;
  getActiveBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBannerOrder(id: number, order: number): Promise<Banner>;
  toggleBannerActive(id: number): Promise<Banner>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | null>;
  updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private banners: Map<number, Banner>;
  private settings: SiteSettings | null;
  private currentIds: { [key: string]: number };

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.banners = new Map();
    this.settings = null;
    this.currentIds = { category: 1, product: 1, banner: 1 };

    // Varsayılan kategorileri ekle
    this.initializeCategories();
  }

  private async initializeCategories() {
    // Ana kategoriler
    const beyazEsya = await this.createCategory({
      name: "Beyaz Eşya",
      slug: "beyaz-esya",
      menuOrder: 1,
      parentId: null
    });

    const televizyon = await this.createCategory({
      name: "Televizyon",
      slug: "televizyon",
      menuOrder: 2,
      parentId: null
    });

    const kucukEvAletleri = await this.createCategory({
      name: "Küçük Ev Aletleri",
      slug: "kucuk-ev-aletleri",
      menuOrder: 3,
      parentId: null
    });

    const kisiselBakim = await this.createCategory({
      name: "Kişisel Bakım",
      slug: "kisisel-bakim",
      menuOrder: 4,
      parentId: null
    });

    // Beyaz Eşya alt kategorileri
    await this.createCategory({
      name: "Çamaşır Makineleri",
      slug: "camasir-makineleri",
      menuOrder: 1,
      parentId: beyazEsya.id
    });

    await this.createCategory({
      name: "Bulaşık Makineleri",
      slug: "bulasik-makineleri",
      menuOrder: 2,
      parentId: beyazEsya.id
    });

    await this.createCategory({
      name: "Kurutma Makineleri",
      slug: "kurutma-makineleri",
      menuOrder: 3,
      parentId: beyazEsya.id
    });

    await this.createCategory({
      name: "Buzdolabı",
      slug: "buzdolabi",
      menuOrder: 4,
      parentId: beyazEsya.id
    });

    await this.createCategory({
      name: "Kurutmalı Çamaşır Makineleri",
      slug: "kurutmali-camasir-makineleri",
      menuOrder: 5,
      parentId: beyazEsya.id
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }

  async getSubCategories(parentId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.parentId === parentId);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentIds.category++;
    const category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      p => p.categoryId === categoryId
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentIds.product++;
    const product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, update: Partial<InsertProduct>): Promise<Product> {
    const existing = await this.getProductById(id);
    if (!existing) throw new Error("Product not found");
    const updated = { ...existing, ...update };
    this.products.set(id, updated);
    return updated;
  }

  // Banners
  async getBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values()).sort((a, b) => a.order - b.order);
  }

  async getActiveBanners(): Promise<Banner[]> {
    return (await this.getBanners()).filter(b => b.active);
  }

  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const id = this.currentIds.banner++;
    const banner = { ...insertBanner, id };
    this.banners.set(id, banner);
    return banner;
  }

  async updateBannerOrder(id: number, order: number): Promise<Banner> {
    const banner = this.banners.get(id);
    if (!banner) throw new Error("Banner not found");
    const updated = { ...banner, order };
    this.banners.set(id, updated);
    return updated;
  }

  async toggleBannerActive(id: number): Promise<Banner> {
    const banner = this.banners.get(id);
    if (!banner) throw new Error("Banner not found");
    const updated = { ...banner, active: !banner.active };
    this.banners.set(id, updated);
    return updated;
  }

  // Site Settings metodları
  async getSiteSettings(): Promise<SiteSettings | null> {
    return this.settings;
  }

  async updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    const id = 1; // Site ayarları için tek bir kayıt kullanıyoruz
    const siteSettings = { ...settings, id };
    this.settings = siteSettings;
    return siteSettings;
  }
}

export const storage = new MemStorage();