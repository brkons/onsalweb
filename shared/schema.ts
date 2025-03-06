import { pgTable, text, serial, integer, boolean, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// SEO için slug helper fonksiyonu
export const generateSeoSlug = (slug: string) => {
  return `onsal-elektronik-en-ucuz-en-kaliteli-www-onsalelektronik-com-${slug}`;
};

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id").references(() => categories.id),
  menuOrder: integer("menu_order").default(0).notNull(),
  description: text("description").default("").notNull(),
  imageUrl: text("image_url").default("").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  specs: jsonb("specs").$type<Record<string, string>>().notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array().notNull().default([]),
  sourceUrl: text("source_url"),
  brand: text("brand").notNull(),
  brandLogoUrl: text("brand_logo_url"),
  authorizedDealerLogoUrl: text("authorized_dealer_logo_url"),
  warrantyPeriod: text("warranty_period"),
  technicalServiceLogoUrl: text("technical_service_logo_url"),
  authorizedDealerUrl: text("authorized_dealer_url"),
  technicalServiceUrl: text("technical_service_url"),
  discountLabelColor: text("discount_label_color").default("#dc2626"),
  price: numeric("price").notNull(),
  discountedPrice: numeric("discounted_price"),
  featured: boolean("featured").default(false).notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull(),
  active: boolean("active").default(true).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  logo: text("logo").notNull(),
  favicon: text("favicon").notNull(),
  companyName: text("company_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  whatsappButtonText: text("whatsapp_button_text").default("Bilgi Al").notNull(),
  callButtonText: text("call_button_text").default("Ara").notNull(),
  instagramButtonText: text("instagram_button_text").default("Takip Et").notNull(),
  mapsEmbed: text("maps_embed"),
  facebook: text("facebook"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  aboutUs: text("about_us").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
});

export const themeSettings = pgTable("theme_settings", {
  id: serial("id").primaryKey(),
  primaryColor: text("primary_color").notNull().default("#007AFF"),
  fontFamily: text("font_family").notNull().default("system-ui"),
  menuTextColor: text("menu_text_color").notNull().default("#FFFFFF"),
  menuBgColor: text("menu_bg_color").notNull().default("#000000"),
  menuOpacity: text("menu_opacity").notNull().default("0.8"),
  borderRadius: text("border_radius").notNull().default("0.5rem"),
  appearance: text("appearance").notNull().default("system"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertBannerSchema = createInsertSchema(banners).omit({ id: true });
export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({ id: true });
export const insertThemeSettingsSchema = createInsertSchema(themeSettings).omit({ id: true });

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type ThemeSettings = typeof themeSettings.$inferSelect;
export type InsertThemeSettings = z.infer<typeof insertThemeSettingsSchema>;