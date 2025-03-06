import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/layout";
import CategoryForm from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@shared/schema";
import { Pencil } from "lucide-react";

export default function AdminCategories() {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const { data: categories = [] } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kategoriler</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Kategori Ekle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm 
              onSuccess={handleClose} 
              initialData={editingCategory}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            {category.imageUrl && (
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                /{category.slug}
              </p>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(category)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}