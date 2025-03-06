import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Category, InsertCategory, insertCategorySchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CategoryFormProps {
  onSuccess?: () => void;
  initialData?: Category;
}

export default function CategoryForm({ onSuccess, initialData }: CategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      menuOrder: 0,
      parentId: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const res = await apiRequest(
        initialData ? "PATCH" : "POST",
        initialData ? `/api/categories/${initialData.id}` : "/api/categories",
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ 
        title: "Başarılı", 
        description: `Kategori başarıyla ${initialData ? 'güncellendi' : 'oluşturuldu'}`
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: `Kategori ${initialData ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu`,
        variant: "destructive",
      });
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Adı</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    if (!initialData) {
                      form.setValue("slug", generateSlug(e.target.value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Kategori açıklamasını girin..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Görsel URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/image.jpg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            initialData ? "Güncelleniyor..." : "Oluşturuluyor..."
          ) : (
            initialData ? "Kategoriyi Güncelle" : "Kategori Oluştur"
          )}
        </Button>
      </form>
    </Form>
  );
}