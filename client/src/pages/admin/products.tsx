import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/seo";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminProducts() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products = [] } = useQuery<Product[]>({ 
    queryKey: ["/api/products"] 
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Başarılı", description: "Ürün başarıyla silindi" });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDelete = async (productId: number) => {
    await deleteProductMutation.mutate(productId);
  };

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
            <Button onClick={() => setSelectedProduct(null)}>Yeni Ürün Ekle</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
            </DialogHeader>
            <ProductForm 
              onSuccess={() => setOpen(false)} 
              initialData={selectedProduct}
            />
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
                <p>SEO Başlığı: {product.seoTitle || "Belirtilmemiş"}</p>
                <p>SEO Açıklaması: {product.seoDescription || "Belirtilmemiş"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {product.featured && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  Öne Çıkan
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(product.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}