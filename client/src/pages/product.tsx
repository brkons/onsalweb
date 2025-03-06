import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ImageGallery from "react-image-gallery";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import SEO from "@/components/seo";
import Footer from "@/components/footer";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "wouter";
import "react-image-gallery/styles/css/image-gallery.css";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", { slug: params.slug }],
    queryFn: async () => {
      const res = await fetch(`/api/products?slug=${params.slug}`);
      if (!res.ok) throw new Error("Ürün bulunamadı");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) return null;

  const images = [
    {
      original: product.imageUrl,
      thumbnail: product.imageUrl
    },
    ...(product.imageUrls || []).map(url => ({
      original: url,
      thumbnail: url
    }))
  ];

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(numericPrice);
  };

  const formatWhatsAppMessage = () => {
    return encodeURIComponent(`Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`);
  };

  const settings = { whatsapp: "905551234567", whatsappButtonText: "Bilgi Al", callButtonText: "Ara" }; //Example

  const formatWhatsAppNumber = (number: string | undefined) => {
    return number ? number.replace(/\D/g, "") : "";
  };

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.shortDescription}
        type="product"
      />

      <Navbar />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Anasayfa</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/kategori/${product.categoryId}`}>Kategori</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sol: Fotoğraf Galerisi */}
            <div className="relative">
              <ImageGallery
                items={images}
                showPlayButton={false}
                showFullscreenButton={true}
                useBrowserFullscreen={false}
                showNav={true}
              />

              {/* İndirim Etiketi */}
              {product.discountedPrice && (
                <div
                  className="absolute top-4 right-4 px-6 py-3 rounded-full text-2xl font-bold shadow-lg"
                  style={{
                    backgroundColor: product.discountLabelColor || "#dc2626",
                    color: "#ffffff",
                  }}
                >
                  %{Math.round(100 - (Number(product.discountedPrice) * 100 / Number(product.price)))} İndirim
                </div>
              )}
            </div>

            {/* Sağ: Ürün Bilgileri */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-medium mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  {product.brandLogoUrl && (
                    <img
                      src={product.brandLogoUrl}
                      alt={product.brand}
                      className="h-12 object-contain"
                    />
                  )}
                  <p className="text-xl text-muted-foreground">{product.brand}</p>
                </div>
              </div>

              {/* Fiyat Bilgisi */}
              <div className="flex flex-col gap-2">
                {product.discountedPrice ? (
                  <>
                    <span className="text-3xl font-medium text-primary">
                      {formatPrice(product.discountedPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-medium text-primary">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Yetkili Satıcı ve Teknik Servis Bilgileri */}
              <div className="grid grid-cols-2 gap-4">
                {product.authorizedDealerLogoUrl && (
                  <a
                    href={product.authorizedDealerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/10 transition-colors"
                  >
                    <img
                      src={product.authorizedDealerLogoUrl}
                      alt="Yetkili Satıcı"
                      className="h-12 object-contain mb-2"
                    />
                    <span className="text-sm text-muted-foreground text-center">
                      Yetkili Satıcı
                    </span>
                  </a>
                )}

                {product.technicalServiceLogoUrl && (
                  <a
                    href={product.technicalServiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/10 transition-colors"
                  >
                    <img
                      src={product.technicalServiceLogoUrl}
                      alt="Teknik Servis"
                      className="h-12 object-contain mb-2"
                    />
                    <span className="text-sm text-muted-foreground text-center">
                      Teknik Servis
                    </span>
                  </a>
                )}
              </div>

              {/* Garanti Bilgisi */}
              {product.warrantyPeriod && (
                <div className="p-4 border rounded-lg bg-muted/10">
                  <p className="text-lg font-medium">Garanti</p>
                  <p className="text-muted-foreground">{product.warrantyPeriod}</p>
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-lg">{product.shortDescription}</p>
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="border rounded-lg p-6 bg-muted/10">
                  <h2 className="text-lg font-medium mb-4">Teknik Özellikler</h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-muted-foreground">{key}</dt>
                        <dd className="text-sm font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#20BD5B] flex-1"
                  onClick={() => window.open(`https://wa.me/${formatWhatsAppNumber(settings?.whatsapp)}?text=${formatWhatsAppMessage()}`, '_blank')}
                >
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  {settings?.whatsappButtonText || "Bilgi Al"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white flex-1"
                  onClick={() => window.open(`tel:${formatWhatsAppNumber(settings?.whatsapp)}`, '_blank')}
                >
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  {settings?.callButtonText || "Ara"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}