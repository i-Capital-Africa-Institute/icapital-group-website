import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  GET_PREVIOUS_SUMMIT_PAGE,
  GET_SUMMIT_DETAIL_BY_SLUG,
} from "@/graphql/eafs/previousSummit";
import { executeEafsServerQuery } from "@/lib/serverEafsClient";
import EafsSummitDetail from "./EafsSummitDetail";

export const revalidate = 3600;

interface SummitDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const data = await executeEafsServerQuery<{
      previousSummitPage?: {
        eafs_previous_summit_highlights?: { slug: string }[];
      };
    }>(GET_PREVIOUS_SUMMIT_PAGE);

    const highlights =
      data?.previousSummitPage?.eafs_previous_summit_highlights || [];

    return highlights.map((summit) => ({ slug: summit.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: SummitDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await executeEafsServerQuery<{
    eafsPreviousSummitDetails?: { summitTitle?: string }[];
  }>(GET_SUMMIT_DETAIL_BY_SLUG, { slug });

  const summit = data?.eafsPreviousSummitDetails?.[0];

  return {
    title: summit?.summitTitle
      ? `${summit.summitTitle} | East Africa Finance Summit`
      : "Summit Detail | East Africa Finance Summit",
  };
}

export default async function SummitDetailPage({
  params,
}: SummitDetailPageProps) {
  const { slug } = await params;
  const data = await executeEafsServerQuery<{
    eafsPreviousSummitDetails?: Record<string, unknown>[];
  }>(GET_SUMMIT_DETAIL_BY_SLUG, { slug });

  const summit = data?.eafsPreviousSummitDetails?.[0];

  if (!summit) {
    notFound();
  }

  return <EafsSummitDetail summit={summit} slug={slug} />;
}
