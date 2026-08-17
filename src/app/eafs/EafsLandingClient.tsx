"use client";

import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const sectionFallback = <SectionSkeleton minHeight="min-h-[400px]" />;

const Hero = dynamic(() => import("@/components/eafs/Landing/Hero"), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-screen" />,
});
const About = dynamic(() => import("@/components/eafs/Landing/About"), {
  ssr: false,
  loading: () => sectionFallback,
});
const WhyAttend = dynamic(() => import("@/components/eafs/Landing/WhyAttend"), {
  ssr: false,
  loading: () => sectionFallback,
});
const KeyThemes = dynamic(() => import("@/components/eafs/Landing/KeyThemes"), {
  ssr: false,
  loading: () => sectionFallback,
});
const ExplorePreviousSummits = dynamic(
  () => import("@/components/eafs/Landing/ExplorePreviousSummits"),
  { ssr: false, loading: () => sectionFallback },
);
const WhoAttends = dynamic(() => import("@/components/eafs/Landing/WhoAttends"), {
  ssr: false,
  loading: () => sectionFallback,
});
const PreviousSpeeches = dynamic(
  () => import("@/components/eafs/Landing/PreviousSpeeches"),
  { ssr: false, loading: () => sectionFallback },
);
const Testimonials = dynamic(
  () => import("@/components/eafs/Landing/Testimonials"),
  { ssr: false, loading: () => sectionFallback },
);
const OrganizersPartners = dynamic(
  () => import("@/components/eafs/Landing/OrganizersPartners"),
  { ssr: false, loading: () => <SectionSkeleton minHeight="min-h-[300px]" /> },
);
const NumbersStats = dynamic(
  () => import("@/components/eafs/Landing/NumbersStats"),
  { ssr: false, loading: () => <SectionSkeleton minHeight="min-h-[300px]" /> },
);
const RegistrationCTA = dynamic(
  () => import("@/components/eafs/Landing/RegistrationCTA"),
  { ssr: false, loading: () => <SectionSkeleton minHeight="min-h-[250px]" /> },
);

export default function EafsLandingClient() {
  return (
    <>
      <Hero />
      <About />
      <WhyAttend />
      <KeyThemes />
      <ExplorePreviousSummits />
      <WhoAttends />
      <PreviousSpeeches />
      <Testimonials />
      <OrganizersPartners />
      <NumbersStats />
      <RegistrationCTA />
    </>
  );
}
