import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import GetStarted from "@/components/Home/GetStarted";
import {
  GET_PORTFOLIO_BY_SLUG,
  GET_ALL_PORTFOLIOS,
} from "@/graphql/portfolio/portfolio";
import { GET_GET_STARTED_SECTION } from "@/graphql/home/home";
import ChallengeSolutionAnimated from "./ChallengeSolutionAnimated";
import ClientCard from "./ClientCard";
import OtherProjects from "./OtherProjects";
import { executeServerQuery } from "@/lib/serverApolloClient";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

export const revalidate = 3600;

interface PortfolioDetailProps {
  params: {
    slug: string;
  };
}

// Generate static params for all portfolios at build time
export async function generateStaticParams() {
  try {
    const allPortfoliosData: any = await executeServerQuery(GET_ALL_PORTFOLIOS);
    const portfolios = allPortfoliosData?.portfolios || [];

    return portfolios.map((portfolio: any) => ({
      slug: portfolio.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PortfolioDetailProps): Promise<Metadata> {
  const { slug } = await params;

  const portfolioData: any = await executeServerQuery(GET_PORTFOLIO_BY_SLUG, {
    slug,
  });

  if (!portfolioData?.portfolios?.length) {
    return {
      title: "Portfolio Not Found",
    };
  }

  const portfolio = portfolioData.portfolios[0];

  return {
    title: `${portfolio.title} | i-Capital Africa Institute`,
    description:
      portfolio.clientDescription ||
      `Portfolio project for ${portfolio.clientName}`,
    openGraph: {
      title: portfolio.title,
      description: portfolio.clientDescription,
      images: portfolio.cardImage?.url
        ? [getStrapiImageUrl(portfolio.cardImage.url)]
        : [],
    },
  };
}

const PortfolioDetail = async ({ params }: PortfolioDetailProps) => {
  // Await params for Next.js 15+
  const { slug } = await params;

  // Fetch portfolio data and all portfolios in parallel
  const [portfolioData, allPortfoliosData, getStartedData]: any[] =
    await Promise.all([
      executeServerQuery(GET_PORTFOLIO_BY_SLUG, { slug }),
      executeServerQuery(GET_ALL_PORTFOLIOS),
      executeServerQuery(GET_GET_STARTED_SECTION),
    ]);

  // Check if portfolio exists
  if (!portfolioData?.portfolios?.length) {
    notFound();
  }

  const portfolio = portfolioData.portfolios[0];

  // Get up to 3 other projects, excluding the current one
  const allPortfolios = allPortfoliosData?.portfolios || [];
  const otherProjects = allPortfolios
    .filter((p: any) => p.slug !== slug)
    .slice(0, 3);

  return (
    <main className="relative min-h-screen bg-[#fafafa] selection:bg-[#F78019] selection:text-white">
      {/* Decorative Premium Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top Gradient */}
        <div className="absolute left-0 top-0 h-[70vh] w-full bg-gradient-to-b from-orange-100/40 via-[#fafafa] to-[#fafafa]" />
        {/* Abstract Blobs */}
        <div className="absolute -right-40 -top-40 h-[800px] w-[800px] rounded-full bg-[#F78019]/5 blur-[120px]" />
        <div className="absolute -left-40 top-[20%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header iconColor="text-black" />

        {/* Content Container */}
        <div className="container mx-auto flex-1 px-6 pb-24 pt-32 lg:px-16">
          {/* Client Section - Modernized with Animation and Project Title */}
          <ClientCard
            client={{
              name: portfolio.clientName,
              description: portfolio.clientDescription,
              website: portfolio.clientWebsite,
            }}
            logoImg={
              portfolio.logoImage && getStrapiImageUrl(portfolio.logoImage.url)
            }
            projectTitle={portfolio.title}
          />

          {/* Challenge & Solution Section */}
          <div className="mt-20 lg:mt-32">
            <ChallengeSolutionAnimated
              problem={portfolio.problem}
              problemPoints={
                portfolio.problemPoint?.map((p: any) => p.point) || []
              }
              solution={portfolio.solution}
              solutionPoints={
                portfolio.solutionPoint?.map((p: any) => p.point) || []
              }
            />
          </div>
        </div>
        <div className="relative z-10 bg-[#fafafa] py-16">
          <div className="container mx-auto px-6 lg:px-16">
            {/* Other Projects Section - Now dynamic */}
            <OtherProjects projects={otherProjects} />
          </div>
        </div>

        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default PortfolioDetail;
