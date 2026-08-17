import { Metadata } from "next";
import Footer from "@/components/Home/Footer";
import Subscribe from "@/components/Home/Subscribe";
import GetStarted from "@/components/Home/GetStarted";
import { GET_ARTICLES } from "@/graphql/news/news";
import {
  GET_SUBSCRIBE_SECTION,
  GET_GET_STARTED_SECTION,
} from "@/graphql/home/home";
import { executeServerQuery } from "@/lib/serverApolloClient";
import NewsHero from "./NewsHero";
import NewsClient from "./NewsClient";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "News & Updates | i-Capital Africa Institute",
  description:
    "Latest insights, announcements, and stories from The i-Capital Africa Institute",
};

export default async function NewsPage() {
  // Fetch all data server-side in parallel
  const [articlesData, subscribeData, getStartedData]: any[] =
    await Promise.all([
      executeServerQuery(GET_ARTICLES),
      executeServerQuery(GET_SUBSCRIBE_SECTION),
      executeServerQuery(GET_GET_STARTED_SECTION),
    ]);

  // Extract articles from response (flattened array)
  const articles = articlesData?.articles || [];

  return (
    <main className="relative min-h-screen bg-gray-50">
      <NewsHero />
      <NewsClient articles={articles} />
      <Subscribe subscribeData={subscribeData} />
      {/* <GetStarted getStartedData={getStartedData} /> */}
      <Footer />
    </main>
  );
}
