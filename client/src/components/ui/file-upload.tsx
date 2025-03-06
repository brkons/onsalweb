import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
}

export function FileUpload({ onUpload, accept = "image/*" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Dosya yüklenirken bir hata oluştu");
      }

      onUpload(data.url);
      toast({ title: "Başarılı", description: "Dosya başarıyla yüklendi" });
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      toast({
        title: "Hata",
        description: "Dosya yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <span>{isUploading ? "Yükleniyor..." : "Dosya Seç"}</span>
        </Button>
      </label>
    </div>
  );
}
