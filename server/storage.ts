import { 
  Category, InsertCategory,
  Product, InsertProduct,
  Banner, InsertBanner,
  SiteSettings, InsertSiteSettings,
  ThemeSettings, InsertThemeSettings
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
  getProductBySlug(slug: string): Promise<Product | undefined>;

  // Banners  
  getBanners(): Promise<Banner[]>;
  getActiveBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBannerOrder(id: number, order: number): Promise<Banner>;
  toggleBannerActive(id: number): Promise<Banner>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | null>;
  updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;

  // Theme Settings
  getThemeSettings(): Promise<ThemeSettings | null>;
  updateThemeSettings(settings: InsertThemeSettings): Promise<ThemeSettings>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private banners: Map<number, Banner>;
  private settings: SiteSettings | null;
  private themeSettings: ThemeSettings | null;
  private currentIds: { [key: string]: number };

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.banners = new Map();
    this.settings = null;
    this.themeSettings = null;
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
      parentId: null,
      description: "En kaliteli beyaz eşya markaları ve modelleri uygun fiyatlarla sizleri bekliyor.",
      imageUrl: "",
    });

    const televizyon = await this.createCategory({
      name: "Televizyon",
      slug: "televizyon",
      menuOrder: 2,
      parentId: null,
      description: "En son teknoloji televizyonlar ve akıllı TV sistemleri burada.",
      imageUrl: "",
    });

    const kucukEvAletleri = await this.createCategory({
      name: "Küçük Ev Aletleri",
      slug: "kucuk-ev-aletleri",
      menuOrder: 3,
      parentId: null,
      description: "Mutfaktan banyoya, pratik ve kaliteli küçük ev aletleri.",
      imageUrl: "",
    });

    const kisiselBakim = await this.createCategory({
      name: "Kişisel Bakım",
      slug: "kisisel-bakim",
      menuOrder: 4,
      parentId: null,
      description: "Kişisel bakım ve güzellik için ihtiyacınız olan tüm ürünler.",
      imageUrl: "",
    });

    // Beyaz Eşya alt kategorileri
    await this.createCategory({
      name: "Çamaşır Makineleri",
      slug: "camasir-makineleri",
      menuOrder: 1,
      parentId: beyazEsya.id,
      description: "Enerji tasarruflu ve akıllı çamaşır makineleri.",
      imageUrl: "",
    });

    await this.createCategory({
      name: "Bulaşık Makineleri",
      slug: "bulasik-makineleri",
      menuOrder: 2,
      parentId: beyazEsya.id,
      description: "Çeşitli özelliklere sahip bulaşık makineleri.",
      imageUrl: "",
    });

    await this.createCategory({
      name: "Kurutma Makineleri",
      slug: "kurutma-makineleri",
      menuOrder: 3,
      parentId: beyazEsya.id,
      description: "Giysilerinizi hızlı ve etkili bir şekilde kurutun.",
      imageUrl: "",
    });

    await this.createCategory({
      name: "Buzdolabı",
      slug: "buzdolabi",
      menuOrder: 4,
      parentId: beyazEsya.id,
      description: "Geniş iç hacimli ve enerji verimli buzdolapları.",
      imageUrl: "",
    });

    await this.createCategory({
      name: "Kurutmalı Çamaşır Makineleri",
      slug: "kurutmali-camasir-makineleri",
      menuOrder: 5,
      parentId: beyazEsya.id,
      description: "Zamandan tasarruf sağlayan kurutmalı çamaşır makineleri.",
      imageUrl: "",
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

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentIds.category++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
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

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentIds.product++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, update: Partial<InsertProduct>): Promise<Product> {
    const existing = await this.getProductById(id);
    if (!existing) throw new Error("Product not found");
    const updated = { ...existing, ...update };
    this.products.set(id, updated);
    return updated;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  // Banners
  async getBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values()).sort((a, b) => a.order - b.order);
  }

  async getActiveBanners(): Promise<Banner[]> {
    return (await this.getBanners()).filter(b => b.active);
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const id = this.currentIds.banner++;
    const newBanner = { ...banner, id };
    this.banners.set(id, newBanner);
    return newBanner;
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

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    return this.settings;
  }

  async updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    const id = 1; // Site ayarları için tek bir kayıt kullanıyoruz
    const siteSettings = { ...settings, id };
    this.settings = siteSettings;
    return siteSettings;
  }

  // Theme Settings
  async getThemeSettings(): Promise<ThemeSettings | null> {
    return this.themeSettings;
  }

  async updateThemeSettings(settings: InsertThemeSettings): Promise<ThemeSettings> {
    const id = 1; // Tema ayarları için tek bir kayıt kullanıyoruz
    const themeSettings = { ...settings, id };
    this.themeSettings = themeSettings;
    return themeSettings;
  }
}

export const storage = new MemStorage();