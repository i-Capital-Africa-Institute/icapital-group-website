"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/eafs/PreviousSummitDetail/Hero";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

const RecapRewind = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/RecapRewind"),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> },
);
const OpeningRemark = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/OpeningRemark"),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> },
);
const OpeningSession = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/OpeningSession"),
  { loading: () => <SectionSkeleton minHeight="min-h-[400px]" /> },
);
const SessionBlock = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/SessionBlock"),
  { loading: () => <SectionSkeleton minHeight="min-h-[300px]" /> },
);
const OrganizersPartners = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/OrganizersPartners"),
  { loading: () => <SectionSkeleton minHeight="min-h-[250px]" /> },
);
const StrategicPartners = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/StrategicPartners"),
  { loading: () => <SectionSkeleton minHeight="min-h-[250px]" /> },
);
const PlatiniumSponsors = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/PlatiniumSponsors"),
  { loading: () => <SectionSkeleton minHeight="min-h-[250px]" /> },
);
const ExploreOtherSummits = dynamic(
  () => import("@/components/eafs/PreviousSummitDetail/ExploreOtherSummits"),
  { loading: () => <SectionSkeleton minHeight="min-h-[300px]" /> },
);

interface EafsSummitDetailProps {
  summit: Record<string, unknown>;
  slug: string;
}

const EafsSummitDetail = ({ summit, slug }: EafsSummitDetailProps) => {
  const sessions = Array.isArray(summit.sessionBlock)
    ? summit.sessionBlock
    : summit.sessionBlock
      ? [summit.sessionBlock]
      : [];

  return (
    <main>
      <Hero summit={summit} />
      <RecapRewind summit={summit} />
      <OpeningRemark summit={summit} />
      <OpeningSession summit={summit} />
      {sessions.map((session: Record<string, unknown>, index: number) => (
        <SessionBlock key={index} session={session} />
      ))}
      <OrganizersPartners
        organizersPartners={(summit.organizersPartners as any) || { logosCard: [] }}
      />
      <StrategicPartners
        strategicPartners={(summit.strategicPartners as any) || { logosCard: [] }}
      />
      <PlatiniumSponsors
        platiniumSponsors={(summit.platinuimSponsors as any) || { logosCard: [] }}
      />
      <ExploreOtherSummits currentSummitSlug={slug} />
    </main>
  );
};

export default EafsSummitDetail;
