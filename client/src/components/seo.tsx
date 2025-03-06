import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

export default function SEO({ 
  title, 
  description, 
  canonical,
  type = "website",
  image
}: SEOProps) {
  const siteTitle = "Elektronik & Beyaz Eşya";
  const defaultDescription = "Kaliteli beyaz eşya, televizyon ve küçük ev aletleri";
  
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Helmet>
      {/* Temel Meta Etiketleri */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* Open Graph Meta Etiketleri */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical || currentUrl} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter Card Meta Etiketleri */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
