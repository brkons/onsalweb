import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/layout";
import BannerForm from "@/components/admin/banner-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Banner } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminBanners() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: banners = [], refetch } = useQuery<Banner[]>({ 
    queryKey: ["/api/banners"] 
  });

  const toggleBanner = async (id: number) => {
    try {
      await apiRequest("PATCH", `/api/banners/${id}/toggle`);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle banner status",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Banner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
            </DialogHeader>
            <BannerForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{banner.title}</h3>
              <p className="text-sm text-muted-foreground">
                {banner.description}
              </p>
            </div>
            <Switch
              checked={banner.active}
              onCheckedChange={() => toggleBanner(banner.id)}
            />
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
