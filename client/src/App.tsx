import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { ThemeSettings } from "@shared/schema";
import React from 'react';
import PageTransition from "@/components/page-transition";

import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin/login";
import AdminIndex from "@/pages/admin/index";
import AdminCategories from "@/pages/admin/categories";
import AdminProducts from "@/pages/admin/products";
import AdminBanners from "@/pages/admin/banners";
import AdminSettings from "@/pages/admin/settings";
import AdminTheme from "@/pages/admin/theme";
import NotFound from "@/pages/not-found";
import ProductPage from "@/pages/product";

function Router() {
  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/kategori/:slug" component={CategoryPage} />
        <Route path="/urun/:slug" component={ProductPage} />
        <Route path="/iletisim" component={Contact} />
        <Route path="/admin/giris" component={AdminLogin} />
        <Route path="/admin" component={AdminIndex} />
        <Route path="/admin/kategoriler" component={AdminCategories} />
        <Route path="/admin/urunler" component={AdminProducts} />
        <Route path="/admin/bannerlar" component={AdminBanners} />
        <Route path="/admin/ayarlar" component={AdminSettings} />
        <Route path="/admin/tema" component={AdminTheme} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: theme } = useQuery<ThemeSettings>({ 
    queryKey: ["/api/theme"],
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    // Convert hex to HSL and set primary color
    const hexToHSL = (hex: string) => {
      // Remove the hash if it exists
      hex = hex.replace('#', '');

      // Convert hex to RGB
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h *= 60;
      }

      return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Set theme variables
    root.style.setProperty('--primary', hexToHSL(theme.primaryColor));
    root.style.setProperty('--menu-bg', hexToHSL(theme.menuBgColor));
    root.style.setProperty('--menu-text', hexToHSL(theme.menuTextColor));
    root.style.setProperty('--radius', theme.borderRadius);
    root.style.setProperty('--font-family', theme.fontFamily);

    // Apply font family
    document.body.style.fontFamily = theme.fontFamily;

    // Set appearance mode
    if (theme.appearance === 'dark') {
      root.classList.add('dark');
    } else if (theme.appearance === 'light') {
      root.classList.remove('dark');
    }
  }, [theme]);

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;