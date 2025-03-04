import { useQuery } from "@tanstack/react-query";
import { Banner, Product, Category } from "@shared/schema";
import ShowcaseSection from "@/components/showcase-section";
import ProductGrid from "@/components/product-grid";
import SEO from "@/components/seo";
import Navbar from "@/components/navbar";

export default function Home() {
  const { data: banners = [] } = useQuery<Banner[]>({ 
    queryKey: ["/api/banners/active"] 
  });

  const { data: featuredProducts = [] } = useQuery<Product[]>({ 
    queryKey: ["/api/products/featured"] 
  });

  const { data: categories = [] } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });

  // Ana kategorileri filtrele
  const mainCategories = categories.filter(c => !c.parentId)
    .sort((a, b) => a.menuOrder - b.menuOrder);

  return (
    <div className="bg-background">
      <SEO 
        title="Anasayfa"
        description="En kaliteli beyaz eşya, televizyon ve küçük ev aletleri burada. Öne çıkan ürünlerimizi keşfedin."
        type="website"
      />

      <Navbar />

      {/* Banner'lar */}
      {banners.map((banner) => (
        <ShowcaseSection
          key={banner.id}
          title={banner.title}
          description={banner.description}
          imageUrl={banner.imageUrl}
        />
      ))}

      {/* Kategoriler */}
      {mainCategories.map((category) => (
        <ShowcaseSection
          key={category.id}
          title={category.name}
          description={`En kaliteli ${category.name.toLowerCase()} çeşitleri ve en uygun fiyatlar.`}
          imageUrl="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80"
          href={`/category/${category.slug}`}
        />
      ))}

      {/* Öne çıkan ürünler */}
      <section className="min-h-screen py-32 bg-white">
        <h2 className="text-4xl font-medium text-center mb-16">
          Öne Çıkan Ürünler
        </h2>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}