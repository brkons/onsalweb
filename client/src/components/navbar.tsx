import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Home } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { data: categories = [] } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });

  if (!categories.length) return null;

  const mainCategories = categories.filter(c => !c.parentId)
    .sort((a, b) => a.menuOrder - b.menuOrder);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <nav>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-20 items-center justify-center space-x-12">
            {location !== "/" && (
              <Link
                href="/"
                className="absolute left-8 text-white hover:text-white/80 transition-colors"
              >
                <Home className="w-6 h-6" />
              </Link>
            )}

            {mainCategories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/iletisim"
              className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              İletişim
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}