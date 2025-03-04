import { pgTable, text, serial, integer, boolean, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id").references(() => categories.id),
  menuOrder: integer("menu_order").default(0).notNull(),
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
  brand: text("brand").notNull(),
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
  mapsEmbed: text("maps_embed"),
  facebook: text("facebook"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  aboutUs: text("about_us").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  lastLogin: text("last_login"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertBannerSchema = createInsertSchema(banners).omit({ id: true });
export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({ id: true });
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, passwordHash: true }).extend({
  password: z.string().min(8),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;