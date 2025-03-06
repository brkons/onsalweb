import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Product, generateSeoSlug } from "@shared/schema";
import { SiWhatsapp, SiInstagram } from "react-icons/si";
import { Image } from "@unpic/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  const formatWhatsAppMessage = (product: Product) => {
    return encodeURIComponent(`Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`);
  };

  const formatWhatsAppNumber = (number?: string | null) => {
    if (!number) return "905551234567"; // Default number
    return number.replace(/\D/g, "");
  };

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4"
    >
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-lg h-full bg-transparent">
            <Link href={`/urun/${generateSeoSlug(product.slug)}`}>
              <div className="aspect-square relative cursor-pointer">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fullWidth"
                  width={500}
                  height={500}
                  loading="lazy"
                  className="object-cover w-full h-full rounded-lg"
                />
                {product.discountedPrice && (
                  <div
                    className="absolute top-4 right-4 px-4 py-2 rounded-full text-lg font-bold"
                    style={{
                      backgroundColor: product.discountLabelColor || "#dc2626",
                      color: "#ffffff",
                    }}
                  >
                    %{Math.round(100 - (Number(product.discountedPrice) * 100 / Number(product.price)))} İndirim
                  </div>
                )}
              </div>
            </Link>
            <CardHeader className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{product.brand}</div>
              <Link href={`/urun/${generateSeoSlug(product.slug)}`}>
                <CardTitle className="text-2xl font-medium hover:text-primary cursor-pointer">
                  {product.name}
                </CardTitle>
              </Link>
              <div className="flex items-center justify-between mt-4">
                {product.brandLogoUrl && (
                  <Image
                    src={product.brandLogoUrl}
                    alt={product.brand}
                    width={100}
                    height={32}
                    loading="lazy"
                    className="h-8 object-contain"
                  />
                )}
                <div className="flex gap-2">
                  {product.authorizedDealerLogoUrl && (
                    <a
                      href={product.authorizedDealerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8"
                    >
                      <Image
                        src={product.authorizedDealerLogoUrl}
                        alt="Yetkili Satıcı"
                        width={100}
                        height={32}
                        loading="lazy"
                        className="h-full object-contain"
                      />
                    </a>
                  )}
                  {product.technicalServiceLogoUrl && (
                    <a
                      href={product.technicalServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8"
                    >
                      <Image
                        src={product.technicalServiceLogoUrl}
                        alt="Teknik Servis"
                        width={100}
                        height={32}
                        loading="lazy"
                        className="h-full object-contain"
                      />
                    </a>
                  )}
                </div>
              </div>
              {product.warrantyPeriod && (
                <p className="text-sm text-muted-foreground mt-2">
                  {product.warrantyPeriod}
                </p>
              )}
              <p className="text-muted-foreground mt-2">{product.shortDescription}</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col items-center gap-2 mb-4">
                {product.discountedPrice ? (
                  <>
                    <span className="text-2xl font-medium text-primary">
                      {formatPrice(Number(product.discountedPrice))}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(Number(product.price))}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-medium text-primary">
                    {formatPrice(Number(product.price))}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Link href={`/urun/${generateSeoSlug(product.slug)}`}>
                  <Button variant="default" className="w-full">
                    Ürün Detayları
                  </Button>
                </Link>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="default"
                    className="bg-[#25D366] hover:bg-[#20BD5B]"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${formatWhatsAppNumber(
                          settings?.whatsapp
                        )}?text=${formatWhatsAppMessage(product)}`,
                        "_blank"
                      )
                    }
                  >
                    <SiWhatsapp className="w-4 h-4 mr-2" />
                    {settings?.whatsappButtonText || "Bilgi Al"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                    onClick={() =>
                      window.open(`tel:${formatWhatsAppNumber(settings?.whatsapp)}`, "_blank")
                    }
                  >
                    <SiWhatsapp className="w-4 h-4 mr-2" />
                    {settings?.callButtonText || "Ara"}
                  </Button>
                  {settings?.instagram && (
                    <Button
                      variant="default"
                      className="bg-[#E4405F] hover:bg-[#D03A55]"
                      onClick={() => {
                        window.open(`https://instagram.com/${settings.instagram}`, "_blank");
                      }}
                    >
                      <SiInstagram className="w-4 h-4 mr-2" />
                      {settings?.instagramButtonText || "Takip Et"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}