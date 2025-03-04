import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Product } from "@shared/schema";
import { SiWhatsapp } from "react-icons/si";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatWhatsAppMessage = (product: Product) => {
    return encodeURIComponent(`Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`);
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
            <div className="aspect-square relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg"
                loading="lazy"
              />
              {product.discountedPrice && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                  %{Math.round((1 - product.discountedPrice / product.price) * 100)} İndirim
                </div>
              )}
            </div>
            <CardHeader className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{product.brand}</div>
              <CardTitle className="text-2xl font-medium">{product.name}</CardTitle>
              <p className="text-muted-foreground mt-2">{product.shortDescription}</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col items-center gap-2 mb-4">
                {product.discountedPrice ? (
                  <>
                    <span className="text-2xl font-medium text-primary">
                      {formatPrice(product.discountedPrice)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-medium text-primary">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  variant="default"
                  className="bg-[#25D366] hover:bg-[#20BD5B]"
                  onClick={() => window.open(`https://wa.me/905551234567?text=${formatWhatsAppMessage(product)}`, '_blank')}
                >
                  <SiWhatsapp className="w-4 h-4 mr-2" />
                  Bilgi Al
                </Button>
                <Button
                  variant="outline"
                  className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                  onClick={() => window.open('https://wa.me/905551234567', '_blank')}
                >
                  <SiWhatsapp className="w-4 h-4 mr-2" />
                  WhatsApp'tan Ara
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}