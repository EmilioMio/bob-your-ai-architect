import { Hero } from '@/components/landing/Hero';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LiveEnforcement } from '@/components/landing/LiveEnforcement';
import { Features } from '@/components/landing/Features';
import { ArchitectureShowcase } from '@/components/landing/ArchitectureShowcase';
import { VSCodeCTA } from '@/components/landing/VSCodeCTA';
import { SocialProof } from '@/components/landing/SocialProof';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <InteractiveDemo />
      <HowItWorks />
      <LiveEnforcement />
      <Features />
      <ArchitectureShowcase />
      <VSCodeCTA />
      <SocialProof />
      <Footer />
    </div>
  );
};

export default Index;
