import { SiWhatsapp, SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";

export default function Footer() {
  const { data: settings } = useQuery<SiteSettings>({ 
    queryKey: ["/api/settings"] 
  });

  const { data: theme } = useQuery({ 
    queryKey: ["/api/theme"] 
  });

  const formatWhatsAppNumber = (number?: string | null) => {
    if (!number) return "905551234567"; // Default number
    return number.replace(/\D/g, '');
  };

  return (
    <footer 
      className="text-white"
      style={{
        backgroundColor: theme?.menuBgColor || "#000000",
        color: theme?.menuTextColor || "#FFFFFF"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* İletişim ve Copyright */}
          <div className="text-center md:text-left">
            <a 
              href={`tel:${settings?.phone}`} 
              style={{ 
                color: theme?.menuTextColor || "#FFFFFF",
                opacity: theme?.menuOpacity || "0.8"
              }}
              className="hover:opacity-80"
            >
              {settings?.phone || "+90 (212) 123 45 67"}
            </a>
            <span className="mx-4" style={{ opacity: (parseFloat(theme?.menuOpacity || "0.8") - 0.2).toString() }}>|</span>
            <span style={{ opacity: theme?.menuOpacity || "0.8" }}>
              © {new Date().getFullYear()} {settings?.companyName || "Elektronik & Beyaz Eşya"}
            </span>
          </div>

          {/* WhatsApp ve Instagram Butonları */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-[#25D366] hover:bg-[#20BD5B]"
              onClick={() => window.open(`https://wa.me/${formatWhatsAppNumber(settings?.whatsapp)}`, '_blank')}
            >
              <SiWhatsapp className="w-4 h-4 mr-2" />
              {settings?.whatsappButtonText || "Bilgi Al"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
              onClick={() => window.open(`tel:${formatWhatsAppNumber(settings?.whatsapp)}`)}
            >
              <SiWhatsapp className="w-4 h-4 mr-2" />
              {settings?.callButtonText || "Ara"}
            </Button>
            {settings?.instagram && settings.instagram.length > 0 && (
              <Button
                size="sm"
                className="bg-[#E4405F] hover:bg-[#D03A55]"
                onClick={() => {
                  window.open(`https://instagram.com/${settings.instagram}`, '_blank');
                }}
              >
                <SiInstagram className="w-4 h-4 mr-2" />
                {settings?.instagramButtonText || "Takip Et"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}