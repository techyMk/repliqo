import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { LogosRow } from "@/components/marketing/logos";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { AutomationExamples } from "@/components/marketing/automation-examples";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/cta";
import { MarketingFooter } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <Hero />
      <LogosRow />
      <Features />
      <HowItWorks />
      <AutomationExamples />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <MarketingFooter />
    </main>
  );
}
