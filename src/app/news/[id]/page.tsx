import { notFound } from "next/navigation";
import { Metadata } from "next";
import Footer from "@/components/Home/Footer";
import Subscribe from "@/components/Home/Subscribe";
import GetStarted from "@/components/Home/GetStarted";
import { GET_ARTICLE_BY_SLUG, GET_ARTICLES } from "@/graphql/news/news";
import {
  GET_SUBSCRIBE_SECTION,
  GET_GET_STARTED_SECTION,
} from "@/graphql/home/home";
import { executeServerQuery } from "@/lib/serverApolloClient";
import NewsDetailClient from "./NewsDetailClient";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

export const dynamic = "force-dynamic";
export const revalidate = 900;

const getImageUrl = (url?: string) => {
  if (!url) return "/fallback-image.png";
  return getStrapiImageUrl(url);
};

interface NewsDetailProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all articles at build time
export async function generateStaticParams() {
  try {
    const data: any = await executeServerQuery(GET_ARTICLES);
    const articles = data?.articles || [];

    return articles
      .filter((article: any) => article && article.slug)
      .map((article: any) => ({
        id: article.slug,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: NewsDetailProps): Promise<Metadata> {
  const { id: slug } = await params;

  const data: any = await executeServerQuery(GET_ARTICLE_BY_SLUG, { slug });
  const article = data?.articles?.[0];

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.metaTitle || `${article.title} | i-Capital Africa Institute`,
    description: article.metaDescription || article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.featuredImage?.url
        ? [getImageUrl(article.featuredImage.url)]
        : [],
    },
  };
}

const NewsDetail = async ({ params }: NewsDetailProps) => {
  const { id: slug } = await params;

  // Fetch all data server-side in parallel
  const [articleData, allArticlesData, subscribeData, getStartedData]: any[] =
    await Promise.all([
      executeServerQuery(GET_ARTICLE_BY_SLUG, { slug }),
      executeServerQuery(GET_ARTICLES),
      executeServerQuery(GET_SUBSCRIBE_SECTION),
      executeServerQuery(GET_GET_STARTED_SECTION),
    ]);

  const article = articleData?.articles?.[0];

  if (!article) {
    notFound();
  }

  // Get latest 3 articles excluding the current one for sidebar
  const allArticles = allArticlesData?.articles || [];
  const relatedArticles = allArticles
    .filter((a: any) => a && a.slug && a.slug !== slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50">
      <NewsDetailClient article={article} relatedArticles={relatedArticles} />
      <Subscribe subscribeData={subscribeData} />
      {/* <GetStarted getStartedData={getStartedData} /> */}
      <Footer />
    </main>
  );
};

export default NewsDetail;
