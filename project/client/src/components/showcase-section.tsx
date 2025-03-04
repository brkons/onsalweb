import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ShowcaseSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
}

export default function ShowcaseSection({
  title,
  description,
  imageUrl,
  href,
}: ShowcaseSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex flex-col items-center justify-center pb-20 pt-32 overflow-hidden snap-start"
      style={{
        background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center px-4 mb-12"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {href ? (
          <Link href={href}>
            <Button variant="default" size="lg" className="min-w-[200px]">
              İncele
            </Button>
          </Link>
        ) : (
          <>
            <Button variant="default" size="lg" className="min-w-[200px]">
              Detayları İncele
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Daha Fazla Bilgi
            </Button>
          </>
        )}
      </motion.div>
    </section>
  );
}