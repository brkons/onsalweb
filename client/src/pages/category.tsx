import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import ProductGrid from "@/components/product-grid";
import SEO from "@/components/seo";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "wouter";
import { 
  GiWashingMachine, 
  GiBlender, 
  GiCookingPot,
  GiVacuumCleaner
} from "react-icons/gi";
import { 
  MdKitchen, 
  MdAir, 
  MdMicrowave,
  MdCleaningServices
} from "react-icons/md";

const categoryIcons: Record<string, React.ComponentType<any>> = {
  "camasir-makinesi": GiWashingMachine,
  "buzdolabi": MdKitchen,
  "bulasik-makinesi": MdCleaningServices,
  "firin": MdMicrowave,
  "klima": MdAir,
  "elektrikli-supurge": GiVacuumCleaner,
  "ankastre": GiCookingPot,
  "blender": GiBlender
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });

  const currentCategory = categories.find(c => c.slug === params.slug);
  const subCategories = currentCategory ? categories.filter(c => c.parentId === currentCategory.id) : [];

  const { data: products = [] } = useQuery<Product[]>({ 
    queryKey: ["/api/products", { categoryId: selectedSubCategory || params.slug }],
    queryFn: async () => {
      const categoryId = selectedSubCategory 
        ? categories.find(c => c.slug === selectedSubCategory)?.id
        : currentCategory?.id;

      if (!categoryId) return [];
      return fetch(`/api/products?categoryId=${categoryId}`).then(res => res.json());
    }
  });

  if (!currentCategory) return null;

  return (
    <div className="bg-background min-h-screen">
      <SEO 
        title={`${currentCategory.name} Ürünleri`}
        description={`${currentCategory.name} kategorisindeki tüm ürünlerimizi keşfedin.`}
        type="website"
      />

      <Navbar />

      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Anasayfa</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentCategory.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section with Subcategories */}
        <section 
          className="relative min-h-[50vh] flex items-center justify-center"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-medium mb-6 capitalize">
              {currentCategory.name}
            </h1>

            {subCategories.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                {subCategories.map((subCategory) => {
                  const Icon = categoryIcons[subCategory.slug] || GiWashingMachine;
                  return (
                    <button
                      key={subCategory.id}
                      onClick={() => setSelectedSubCategory(
                        selectedSubCategory === subCategory.slug ? null : subCategory.slug
                      )}
                      className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                        selectedSubCategory === subCategory.slug 
                          ? 'bg-white text-primary' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium block">
                        {subCategory.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ProductGrid products={products} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}