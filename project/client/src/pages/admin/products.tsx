import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/layout";
import ProductForm from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@shared/schema";
import SEO from "@/components/seo";

export default function AdminProducts() {
  const [open, setOpen] = useState(false);
  const { data: products = [] } = useQuery<Product[]>({ 
    queryKey: ["/api/products"] 
  });

  return (
    <AdminLayout>
      <SEO 
        title="Ürün Yönetimi"
        description="Ürün ekleme, düzenleme ve SEO yönetimi"
        type="website"
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ürünler</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Ürün Ekle</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni Ürün Ekle</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>SEO Başlık: {product.seoTitle || "Belirtilmemiş"}</p>
                <p>SEO Açıklama: {product.seoDescription || "Belirtilmemiş"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {product.featured && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  Öne Çıkan
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}