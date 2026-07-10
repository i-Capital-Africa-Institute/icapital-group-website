import { Metadata } from "next";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import GetStarted from "@/components/Home/GetStarted";
import { GET_ALL_PORTFOLIOS } from "@/graphql/portfolio/portfolio";
import { GET_GET_STARTED_SECTION } from "@/graphql/home/home";
import { executeServerQuery } from "@/lib/serverApolloClient";
import Image from "next/image";
import Link from "next/link";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Portfolios | i-Capital Africa Institute",
  description: "Explore our successful projects and partnerships.",
};

export default async function PortfoliosPage() {
  const [allPortfoliosData, getStartedData]: any[] = await Promise.all([
    executeServerQuery(GET_ALL_PORTFOLIOS),
    executeServerQuery(GET_GET_STARTED_SECTION),
  ]);

  const portfolios = allPortfoliosData?.portfolios || [];

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

        <div className="container mx-auto flex-1 px-6 pb-24 pt-32 lg:px-16">
          <div className="mb-16 text-center lg:mb-24">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-7xl">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Portfolios</span>
            </h1>
            <p className="mt-6 text-lg font-medium text-slate-600 max-w-2xl mx-auto md:text-xl">
              Discover how we partner with leading organizations to drive innovation, impact, and success.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((project: any) => (
              <Link key={project.slug} href={`/portfolios/${project.slug}`} passHref>
                <div className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  {/* Image Container with Hover Shine */}
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50/50 to-white px-8 py-10">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-150%] transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
                    <Image
                      src={getStrapiImageUrl(project.cardImage?.url)}
                      alt={project.title}
                      width={280}
                      height={160}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Content Container */}
                  <div className="flex flex-1 flex-col justify-between p-8 border-t border-slate-50">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-orange-500 transition-colors">
                      {project.title}
                    </h3>
                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                        Explore Project
                      </span>
                      <div className="flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 group-hover:border-orange-500 group-hover:bg-orange-500 transition-all duration-300">
                        <span className="text-lg text-slate-400 group-hover:text-white transition-colors">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {portfolios.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-slate-500">No portfolios found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-20">
          <GetStarted getStartedData={getStartedData} />
          <Footer />
        </div>
      </div>
    </main>
  );
}
