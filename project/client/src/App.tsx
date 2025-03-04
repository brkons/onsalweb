import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin/login";
import AdminIndex from "@/pages/admin/index";
import AdminCategories from "@/pages/admin/categories";
import AdminProducts from "@/pages/admin/products";
import AdminBanners from "@/pages/admin/banners";
import AdminSettings from "@/pages/admin/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/iletisim" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminIndex} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/banners" component={AdminBanners} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;