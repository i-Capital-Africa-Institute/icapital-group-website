"use client";

import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const Hero = dynamic(() => import("@/components/eafs/PreviousSummit/Hero"), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-screen" />,
});
const SummitListSection = dynamic(
  () => import("@/components/eafs/PreviousSummit/SummitListSection"),
  { ssr: false, loading: () => <SectionSkeleton minHeight="min-h-[600px]" /> },
);

export default function PreviousSummitClient() {
  return (
    <>
      <Hero />
      <SummitListSection />
    </>
  );
}
