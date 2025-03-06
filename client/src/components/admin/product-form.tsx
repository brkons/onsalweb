import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { InsertProduct, insertProductSchema, generateSeoSlug } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/ui/file-upload";

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: Product | null;
}

export default function ProductForm({ onSuccess, initialData }: ProductFormProps) {
  const { toast } = useToast();
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      specs: initialData?.specs || {},
      imageUrl: initialData?.imageUrl || "",
      imageUrls: initialData?.imageUrls || [],
      sourceUrl: initialData?.sourceUrl || "",
      brand: initialData?.brand || "",
      price: initialData?.price || "",
      discountedPrice: initialData?.discountedPrice || "",
      featured: initialData?.featured || false,
      categoryId: initialData?.categoryId,
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
      brandLogoUrl: initialData?.brandLogoUrl || "",
      authorizedDealerLogoUrl: initialData?.authorizedDealerLogoUrl || "",
      authorizedDealerUrl: initialData?.authorizedDealerUrl || "",
      warrantyPeriod: initialData?.warrantyPeriod || "",
      technicalServiceLogoUrl: initialData?.technicalServiceLogoUrl || "",
      technicalServiceUrl: initialData?.technicalServiceUrl || "",
      discountLabelColor: initialData?.discountLabelColor || ""
    },
  });

  const { data: categories = [] } = useQuery({ 
    queryKey: ["/api/categories"] 
  });

  const generateSlug = (name: string) => {
    const baseSlug = name
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

    return generateSeoSlug(baseSlug);
  };

  const fetchExternalMutation = useMutation({
    mutationFn: async (url: string) => {
      console.log("Sending request to fetch from:", url);
      const res = await apiRequest("POST", "/api/products/fetch-external", { url });
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Fetched data:", data);

      if (data.description) {
        form.setValue("description", data.description);
        // Kısa açıklama için ilk 150 karakteri al
        const shortDesc = data.description.replace(/<[^>]*>/g, '').slice(0, 150);
        form.setValue("shortDescription", shortDesc);
      }

      if (data.specs && Object.keys(data.specs).length > 0) {
        form.setValue("specs", data.specs);
      }

      if (data.imageUrls && data.imageUrls.length > 0) {
        // Ana resmi ayarla
        if (!form.getValues("imageUrl")) {
          form.setValue("imageUrl", data.imageUrls[0]);
        }
        // Diğer resimleri ayarla
        form.setValue("imageUrls", data.imageUrls.slice(1));
      }

      toast({ 
        title: "Başarılı", 
        description: `Veriler başarıyla çekildi: ${data.imageUrls?.length || 0} resim, ${Object.keys(data.specs || {}).length} özellik` 
      });
    },
    onError: (error) => {
      console.error("Veri çekme hatası:", error);
      toast({
        title: "Hata",
        description: "Ürün bilgileri çekilirken bir hata oluştu. Lütfen URL'i kontrol edin.",
        variant: "destructive",
      });
    },
  });

  const createOrUpdateProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData ? `/api/products/${initialData.id}` : "/api/products";
      const res = await apiRequest(method, url, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ 
        title: "Başarılı", 
        description: initialData ? "Ürün başarıyla güncellendi" : "Ürün başarıyla oluşturuldu" 
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: initialData ? "Ürün güncellenirken bir hata oluştu" : "Ürün oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleFetchExternal = () => {
    const sourceUrl = form.getValues("sourceUrl");
    if (!sourceUrl) {
      toast({
        title: "Hata",
        description: "Lütfen bir kaynak URL girin",
        variant: "destructive",
      });
      return;
    }
    fetchExternalMutation.mutate(sourceUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createOrUpdateProductMutation.mutate(data))} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün Adı</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      const seoTitle = `${e.target.value} | Elektronik & Beyaz Eşya`;
                      form.setValue("seoTitle", seoTitle);
                      form.setValue("slug", generateSlug(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marka</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiyat (TL)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İndirimli Fiyat (TL)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Harici Kaynak */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
          <h3 className="font-medium">Harici Kaynak</h3>
          <FormField
            control={form.control}
            name="sourceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaynak URL</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/product" />
                  </FormControl>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleFetchExternal}
                    disabled={fetchExternalMutation.isPending}
                  >
                    {fetchExternalMutation.isPending ? "Çekiliyor..." : "Bilgileri Çek"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Açıklamalar */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kısa Açıklama</FormLabel>
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
                <FormLabel>Detaylı Açıklama</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      const seoDescription = e.target.value.slice(0, 155) + (e.target.value.length > 155 ? '...' : '');
                      form.setValue("seoDescription", seoDescription);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SEO Ayarları */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
          <h3 className="font-medium">SEO Ayarları</h3>

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
                <p className="text-sm text-muted-foreground">
                  Bu URL ile ürününüze erişilecek: /product/{field.value}
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seoTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Başlığı</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={60} />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Karakter sayısı: {field.value?.length || 0}/60
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seoDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Açıklaması</FormLabel>
                <FormControl>
                  <Textarea {...field} maxLength={155} />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Karakter sayısı: {field.value?.length || 0}/155
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Yeni Alanlar */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="brandLogoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marka Logo URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/brand-logo.png" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorizedDealerLogoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yetkili Satıcı Logo URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/dealer-logo.png" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorizedDealerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yetkili Satıcı Link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/dealer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warrantyPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garanti Süresi</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="2 Yıl Resmi Distribütör Garantili" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technicalServiceLogoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teknik Servis Logo URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/service-logo.png" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technicalServiceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teknik Servis Link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/service" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountLabelColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İndirim Etiketi Rengi</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input type="color" {...field} className="w-12 h-10 p-1" />
                    <Input type="text" {...field} /> {/* Added text input for color hex code */}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        {/* Ana Görsel */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ana Görsel</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <FileUpload onUpload={(url) => field.onChange(url)} />
                  {field.value && (
                    <div className="relative w-32 h-32">
                      <img
                        src={field.value}
                        alt="Ürün görseli"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Diğer Görseller */}
        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diğer Görseller</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <FileUpload
                    onUpload={(url) => field.onChange([...(field.value || []), url])}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {field.value?.map((url, index) => (
                      <div key={url} className="relative w-24 h-24">
                        <img
                          src={url}
                          alt={`Ürün görseli ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-1 bg-destructive text-destructive-foreground rounded-full"
                          onClick={() => {
                            const newUrls = field.value?.filter((_, i) => i !== index);
                            field.onChange(newUrls);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Diğer Detaylar */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Öne Çıkan Ürün</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={createOrUpdateProductMutation.isPending}>
          {createOrUpdateProductMutation.isPending 
            ? (initialData ? "Güncelleniyor..." : "Oluşturuluyor...") 
            : (initialData ? "Ürünü Güncelle" : "Ürün Oluştur")}
        </Button>
      </form>
    </Form>
  );
}