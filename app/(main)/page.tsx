import { Hero } from "@/components/home/Hero";
import { ModelShowcase } from "@/components/home/ModelShowcase";
import { CotizarSection } from "@/components/home/CotizarSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div id="modelos">
        <ModelShowcase />
      </div>
      <CotizarSection />
    </>
  );
}