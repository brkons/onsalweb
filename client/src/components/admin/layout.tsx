import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/admin", label: "Panel" },
    { href: "/admin/kategoriler", label: "Kategoriler" },
    { href: "/admin/urunler", label: "Ürünler" },
    { href: "/admin/bannerlar", label: "Banner'lar" },
    { href: "/admin/ayarlar", label: "Site Ayarları" },
    { href: "/admin/tema", label: "Tema Ayarları" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center">
            <div className="flex space-x-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}