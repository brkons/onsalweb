import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductGrid from "@/components/product-grid";
import SEO from "@/components/seo";
import Navbar from "@/components/navbar";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { data: products = [] } = useQuery<Product[]>({ 
    queryKey: ["/api/products", params.slug] 
  });

  return (
    <div className="bg-background">
      <SEO 
        title={`${params.slug} Ürünleri`}
        description={`${params.slug} kategorisindeki tüm ürünlerimizi keşfedin.`}
        type="website"
      />

      <Navbar />

      <main>
        {/* Hero Section */}
        <section 
          className="relative min-h-screen flex items-center justify-center"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-medium mb-6 capitalize tracking-tight">
              {params.slug.replace(/-/g, ' ')}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/80">
              En kaliteli ürünleri keşfedin
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ProductGrid products={products} />
          </div>
        </section>
      </main>
    </div>
  );
}