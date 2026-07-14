import { Metadata } from "next";
import EafsLandingClient from "./EafsLandingClient";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "East Africa Finance Summit | i-Capital Africa Institute",
  description:
    "Join leaders in finance, fintech, and policy at the East Africa Finance Summit.",
};

export default function EafsLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <EafsLandingClient />
    </main>
  );
}
