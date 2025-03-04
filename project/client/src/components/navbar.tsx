import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { AnimatePresence, motion } from "framer-motion";
import { Home } from "lucide-react";

export default function Navbar() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [location] = useLocation();
  const { data: categories = [] } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });

  if (!categories.length) return null;

  const mainCategories = categories.filter(c => !c.parentId)
    .sort((a, b) => a.menuOrder - b.menuOrder);

  const getSubCategories = (parentId: number) => 
    categories.filter(c => c.parentId === parentId);

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
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="relative py-8"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-white hover:text-white/80 transition-colors"
                >
                  {category.name}
                </Link>

                <AnimatePresence>
                  {hoveredCategory === category.id && getSubCategories(category.id).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-48 bg-white border rounded-lg shadow-lg py-2"
                    >
                      {getSubCategories(category.id).map((subCategory) => (
                        <Link
                          key={subCategory.id}
                          href={`/category/${subCategory.slug}`}
                          className="block px-4 py-2 text-sm text-black/80 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          {subCategory.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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