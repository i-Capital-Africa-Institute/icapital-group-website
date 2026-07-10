import { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/Home/Hero";
import Slider from "@/components/Home/Slider";
import Sectors from "@/components/Home/Sectors";
import AboutUs from "@/components/Home/AboutUs";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import ScrollSpyWrapper from "@/components/ScrollSpyWrapper";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { getHomePageData } from "@/lib/getHomePageData";

export const revalidate = 1800;

const UpcomingEvents = dynamic(() => import("@/components/Home/UpcomingEvents"), {
  loading: () => <SectionSkeleton minHeight="min-h-[480px]" />,
});
const Journey = dynamic(() => import("@/components/Home/Journey"), {
  loading: () => <SectionSkeleton minHeight="min-h-[600px]" />,
});
const Portfolio = dynamic(() => import("@/components/Home/Portfolio"), {
  loading: () => <SectionSkeleton minHeight="min-h-[500px]" />,
});
const Subscribe = dynamic(() => import("@/components/Home/Subscribe"), {
  loading: () => <SectionSkeleton minHeight="min-h-[300px]" />,
});
const Testimonials = dynamic(() => import("@/components/Home/Testimonials"), {
  loading: () => <SectionSkeleton minHeight="min-h-[400px]" />,
});
const GetStarted = dynamic(() => import("@/components/Home/GetStarted"), {
  loading: () => <SectionSkeleton minHeight="min-h-[200px]" />,
});
const GetInTouch = dynamic(() => import("@/components/Home/GetInTouch"), {
  loading: () => <SectionSkeleton minHeight="min-h-[500px]" />,
});

export const metadata: Metadata = {
  title: "The i-Capital Africa Institute",
};

const sectionIds = [
  "sectors",
  "about",
  "features",
  "news",
  "journey",
  "portfolio",
  "contact",
];

const HomePage = async () => {
  const data = await getHomePageData();

  return (
    <ScrollSpyWrapper sectionIds={sectionIds}>
      <div>
        <Hero heroData={data.hero} />
        <Slider sliderData={data.slider} />
        <div id="sectors">
          <Sectors sectorsData={data.sectors} />
        </div>
        <div id="about">
          <AboutUs aboutUsData={data.aboutUs} />
        </div>
        <div id="features">
          <Features featuresData={data.features} />
        </div>
        <div id="news">
          <UpcomingEvents upcomingEventsData={data.upcomingEvents} />
        </div>
        <div id="journey">
          <Journey journeyData={data.journey} />
        </div>
        <div id="portfolio">
          <Portfolio portfolioData={data.portfolio} />
        </div>
        <Subscribe subscribeData={data.subscribe} />
        <Testimonials testimonialsData={data.testimonials} />
        <GetStarted getStartedData={data.getStarted} />
        <div id="contact">
          <GetInTouch />
        </div>
        <Footer />
      </div>
    </ScrollSpyWrapper>
  );
};

export default HomePage;
