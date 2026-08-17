import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/eafs/Header";
import EAFSLogo from "@/assets/eafs/EAFS-black-Logo.png";

export const metadata: Metadata = {
  title: "Upcoming Summits | East Africa Finance Summit",
  description: "Information about upcoming East Africa Finance Summit events.",
};

export default function UpcomingSummitsPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="border-b border-gray-100 bg-white">
        <Header logo={EAFSLogo} linkColor="#253E5E" linkActiveColor="#F78019" />
      </div>
      <div className="container mx-auto px-6 py-24 text-center md:px-12">
        <h1 className="text-4xl font-bold text-[#253E5E] md:text-5xl">
          Upcoming Summits
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Details about the next East Africa Finance Summit will be announced
          here. Register your interest on the main summit page.
        </p>
        <Link
          href="/eafs"
          className="mt-10 inline-block rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Back to Summit Home
        </Link>
      </div>
    </main>
  );
}
