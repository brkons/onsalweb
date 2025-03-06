import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { data: settings, isLoading } = useQuery<SiteSettings>({ 
    queryKey: ["/api/settings"] 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  if (!settings) return null;

  const formatWhatsAppNumber = (number?: string | null) => {
    if (!number) return "905551234567"; // Default number
    return number.replace(/\D/g, '');
  };

  return (
    <div className="bg-background min-h-screen pb-24">
      <SEO 
        title="İletişim"
        description={`${settings.companyName} ile iletişime geçin.`}
        type="website"
      />

      <Navbar />

      <main>
        <section 
          className="relative min-h-screen flex items-center justify-center"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-medium mb-6 tracking-tight">
              İletişim
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/80">
              Beyaz eşya, televizyon ve küçük ev aletleri için en kaliteli ürünleri sunuyoruz.<br/>
              Kişisel bakım ürünleri ve en son teknoloji elektronik cihazlar için bizimle iletişime geçin.
            </p>
          </div>
        </section>

        <section className="py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-medium mb-4">Adres</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {settings.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-medium mb-4">Telefon</h2>
                    <p className="text-muted-foreground">
                      <a href={`tel:${settings.phone}`} className="hover:text-primary">
                        {settings.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-medium mb-4">E-posta</h2>
                    <p className="text-muted-foreground">
                      <a href={`mailto:${settings.email}`} className="hover:text-primary">
                        {settings.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-medium mb-4">Harita</h2>
                  {settings.mapsEmbed && (
                    <div 
                      className="aspect-square rounded-lg overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: settings.mapsEmbed }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}