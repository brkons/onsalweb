import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SiteSettings, insertSiteSettingsSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout";

export default function AdminSettings() {
  const { toast } = useToast();
  const { data: settings } = useQuery<SiteSettings>({ 
    queryKey: ["/api/settings"] 
  });

  const form = useForm({
    resolver: zodResolver(insertSiteSettingsSchema),
    values: settings || {
      logo: "",
      favicon: "",
      companyName: "",
      address: "",
      phone: "",
      email: "",
      whatsapp: "",
      mapsEmbed: "",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      aboutUs: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SiteSettings) => {
      const res = await apiRequest("POST", "/api/settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Başarılı", description: "Site ayarları güncellendi" });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Site ayarları güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Site Ayarları</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şirket Adı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">İletişim Bilgileri</h2>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Numarası</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+90XXXXXXXXXX" />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Başında + işareti ile birlikte ülke kodu dahil
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mapsEmbed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps Embed Kodu</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder='<iframe src="https://www.google.com/maps/embed?..." ...' />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Google Maps'ten aldığınız iframe kodunu yapıştırın
                  </p>
                </FormItem>
              )}
            />
          </div>

          {/* Sosyal Medya */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Sosyal Medya</h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* SEO ve İçerik */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">SEO ve İçerik</h2>

            <FormField
              control={form.control}
              name="aboutUs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hakkımızda</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[200px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Başlık</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Açıklama</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </form>
      </Form>
    </AdminLayout>
  );
}