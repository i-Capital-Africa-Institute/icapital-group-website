import { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/eafs/Landing/Hero";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

export const revalidate = 1800;

const About = dynamic(() => import("@/components/eafs/Landing/About"), {
  loading: () => <SectionSkeleton minHeight="min-h-[400px]" />,
});
const WhyAttend = dynamic(() => import("@/components/eafs/Landing/WhyAttend"), {
  loading: () => <SectionSkeleton minHeight="min-h-[400px]" />,
});
const KeyThemes = dynamic(() => import("@/components/eafs/Landing/KeyThemes"), {
  loading: () => <SectionSkeleton minHeight="min-h-[400px]" />,
});
const ExplorePreviousSummits = dynamic(
  () => import("@/components/eafs/Landing/ExplorePreviousSummits"),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> },
);
const WhoAttends = dynamic(() => import("@/components/eafs/Landing/WhoAttends"), {
  loading: () => <SectionSkeleton minHeight="min-h-[400px]" />,
});
const PreviousSpeeches = dynamic(
  () => import("@/components/eafs/Landing/PreviousSpeeches"),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> },
);
const Testimonials = dynamic(
  () => import("@/components/eafs/Landing/Testimonials"),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" />,
  },
);
const OrganizersPartners = dynamic(
  () => import("@/components/eafs/Landing/OrganizersPartners"),
  { loading: () => <SectionSkeleton minHeight="min-h-[300px]" /> },
);
const NumbersStats = dynamic(
  () => import("@/components/eafs/Landing/NumbersStats"),
  { loading: () => <SectionSkeleton minHeight="min-h-[300px]" /> },
);
const RegistrationCTA = dynamic(
  () => import("@/components/eafs/Landing/RegistrationCTA"),
  { loading: () => <SectionSkeleton minHeight="min-h-[250px]" /> },
);

export const metadata: Metadata = {
  title: "East Africa Finance Summit | i-Capital Africa Institute",
  description:
    "Join leaders in finance, fintech, and policy at the East Africa Finance Summit.",
};

export default function EafsLandingPage() {
  return (
    <main>
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
    </main>
  );
}
