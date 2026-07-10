import { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/eafs/PreviousSummit/Hero";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

export const revalidate = 1800;

const SummitListSection = dynamic(
  () => import("@/components/eafs/PreviousSummit/SummitListSection"),
  { loading: () => <SectionSkeleton minHeight="min-h-[600px]" /> },
);

export const metadata: Metadata = {
  title: "Previous Summits | East Africa Finance Summit",
  description: "Explore highlights from past East Africa Finance Summit events.",
};

export default function PreviousSummitPage() {
  return (
    <main id="content">
      <Hero />
      <SummitListSection />
    </main>
  );
}
