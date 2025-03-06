import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ThemeSettings, insertThemeSettingsSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout";

export default function AdminTheme() {
  const { toast } = useToast();
  const { data: settings } = useQuery<ThemeSettings>({ 
    queryKey: ["/api/theme"] 
  });

  const form = useForm({
    resolver: zodResolver(insertThemeSettingsSchema),
    values: settings || {
      primaryColor: "#007AFF",
      fontFamily: "system-ui",
      menuTextColor: "#FFFFFF",
      menuBgColor: "#000000",
      menuOpacity: "0.8",
      borderRadius: "0.5rem",
      appearance: "system",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ThemeSettings) => {
      const res = await apiRequest("POST", "/api/theme", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/theme"] });
      toast({ title: "Başarılı", description: "Tema ayarları güncellendi" });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Tema ayarları güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tema Ayarları</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ana Renk</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} className="w-12 h-10 p-1" />
                      <Input type="text" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="menuTextColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menü Yazı Rengi</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} className="w-12 h-10 p-1" />
                      <Input type="text" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="menuBgColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menü Arkaplan Rengi</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} className="w-12 h-10 p-1" />
                      <Input type="text" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="menuOpacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menü Opaklığı</FormLabel>
                  <FormControl>
                    <Input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      className="w-full" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{(parseFloat(field.value) * 100).toFixed(0)}%</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Font seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="system-ui">Sistem Fontu</SelectItem>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="borderRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Köşe Yuvarlaklığı</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="0.5rem" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appearance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Görünüm</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Görünüm seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Açık Tema</SelectItem>
                      <SelectItem value="dark">Koyu Tema</SelectItem>
                      <SelectItem value="system">Sistem Ayarı</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="p-4 border rounded-lg bg-muted/10">
            <h2 className="text-lg font-medium mb-4">Önizleme</h2>
            <div 
              className="rounded"
              style={{ 
                backgroundColor: form.watch("menuBgColor"),
                color: form.watch("menuTextColor"),
                opacity: form.watch("menuOpacity"),
                padding: "1rem",
                borderRadius: form.watch("borderRadius")
              }}
            >
              <div className="font-medium" style={{ fontFamily: form.watch("fontFamily") }}>
                Menü Önizleme
              </div>
              <div className="mt-4">
                <Button
                  style={{ 
                    backgroundColor: form.watch("primaryColor"),
                    borderRadius: form.watch("borderRadius")
                  }}
                >
                  Buton Önizleme
                </Button>
              </div>
            </div>
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