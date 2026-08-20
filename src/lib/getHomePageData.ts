import { executeServerQuery } from "./serverApolloClient";
import { GET_HOME_PAGE_DATA } from "@/graphql/home/home";
import { GET_ARTICLES } from "@/graphql/news/news";

// Define the types for our data structure
export interface HomePageData {
  hero: any;
  slider: any;
  aboutUs: any;
  features: any;
  upcomingEvents: any;
  journey: any;
  subscribe: any;
  getStarted: any;
  sectors: any;
  portfolio: any;
  testimonials: any;
  news: any[];
}

// Main function to fetch all home page data using parallel optimized queries
export async function getHomePageData(): Promise<HomePageData> {
  try {
    const [homeResponse, articlesResponse]: any[] = await Promise.all([
      executeServerQuery(GET_HOME_PAGE_DATA),
      executeServerQuery(GET_ARTICLES),
    ]);

    const articles = articlesResponse?.articles || [];
    const sortedArticles = [...articles]
      .filter(Boolean)
      .sort((a: any, b: any) => {
        const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
        const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);

    if (!homeResponse?.home) {
      console.warn("No home data returned from GraphQL");
      return {
        hero: { home: null },
        slider: { home: null },
        aboutUs: { home: null },
        features: { home: null },
        upcomingEvents: { home: null },
        journey: { home: null },
        subscribe: { home: null },
        getStarted: { home: null },
        sectors: { home: null },
        portfolio: { home: null },
        testimonials: { home: null },
        news: sortedArticles,
      };
    }

    const homeData = homeResponse.home;

    return {
      hero: { home: homeData },
      slider: { home: homeData },
      aboutUs: { home: homeData },
      features: { home: homeData },
      upcomingEvents: { home: homeData },
      journey: { home: homeData },
      subscribe: { home: homeData },
      getStarted: { home: homeData },
      sectors: { home: homeData },
      portfolio: { home: homeData },
      testimonials: { home: homeData },
      news: sortedArticles,
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);

    return {
      hero: { home: null },
      slider: { home: null },
      aboutUs: { home: null },
      features: { home: null },
      upcomingEvents: { home: null },
      journey: { home: null },
      subscribe: { home: null },
      getStarted: { home: null },
      sectors: { home: null },
      portfolio: { home: null },
      testimonials: { home: null },
      news: [],
    };
  }
}

