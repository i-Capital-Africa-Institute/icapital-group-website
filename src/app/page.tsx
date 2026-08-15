import { Metadata } from "next";
import "../styles/globals.css";
import Hero from "@/components/Home/Hero";
import Slider from "@/components/Home/Slider";
import Sectors from "@/components/Home/Sectors";
import AboutUs from "@/components/Home/AboutUs";
import Features from "@/components/Home/Features";
import UpcomingEvents from "@/components/Home/UpcomingEvents";
import Journey from "@/components/Home/Journey";
import Portfolio from "@/components/Home/Portfolio";
import Subscribe from "@/components/Home/Subscribe";
import Testimonials from "@/components/Home/Testimonials";
import GetInTouch from "@/components/Home/GetInTouch";
import GetStarted from "@/components/Home/GetStarted";
import Footer from "@/components/Home/Footer";
import ScrollSpyWrapper from "@/components/ScrollSpyWrapper";
import { getHomePageData } from "@/lib/getHomePageData";
export const metadata: Metadata = {
  title: "The i-Capital Africa Institute",
};

const sectionIds = [
  "news",
  "sectors",
  "about",
  "features",
  "journey",
  "portfolio",
  "contact",
];

const HomePage = async () => {
  // Fetch all data server-side
  const data = await getHomePageData();

  return (
    <ScrollSpyWrapper sectionIds={sectionIds}>
      <div>
        <Hero heroData={data.hero} />
        <div id="news">
          <UpcomingEvents
            upcomingEventsData={data.upcomingEvents}
            newsData={data.news}
          />
        </div>
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
