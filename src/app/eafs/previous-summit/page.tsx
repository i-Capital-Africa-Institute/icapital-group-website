import { Metadata } from "next";
import PreviousSummitClient from "./PreviousSummitClient";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Previous Summits | East Africa Finance Summit",
  description: "Explore highlights from past East Africa Finance Summit events.",
};

export default function PreviousSummitPage() {
  return (
    <main id="content" className="min-h-screen bg-white">
      <PreviousSummitClient />
    </main>
  );
}
