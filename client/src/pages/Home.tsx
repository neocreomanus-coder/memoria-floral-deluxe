import AnnouncementBar from "@/components/AnnouncementBar";
import BibleVerse from "@/components/BibleVerse";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Footer from "@/components/Footer";
import FunerariasSection from "@/components/FunerariasSection";
import ReviewsSection from "@/components/ReviewsSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import ProductSection from "@/components/ProductSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { trpc } from "@/lib/trpc";
import { SECTION_LABELS } from "../../../drizzle/schema";

function SectionLoader({ section }: { section: keyof typeof SECTION_LABELS }) {
  const { data: products = [] } = trpc.products.bySection.useQuery({ section });
  const meta = SECTION_LABELS[section];
  return (
    <ProductSection
      sectionId={section}
      subtitle={meta.subtitle}
      title={meta.title}
      description={meta.description}
      products={products}
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBadges />
        <FeaturedCarousel />
        <CategoriesSection />

        {/* Coronas Fúnebres */}
        <SectionLoader section="coronas_funebres" />

        {/* Por Menos de $200.000 — justo después de Coronas */}
        <SectionLoader section="por_menos_200" />

        {/* Verso bíblico */}
        <BibleVerse />

        {/* Sudarios */}
        <SectionLoader section="sudarios" />

        {/* Rosas Inmortalizadas */}
        <SectionLoader section="rosas_inmortalizadas" />

        <FunerariasSection />
        <ReviewsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
