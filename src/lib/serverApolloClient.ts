import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createTimedFetch } from "./fetchWithTimeout";

const graphqlUri =
  process.env.NEXT_PUBLIC_API || "http://localhost:1337/graphql";

const httpLink = createHttpLink({
  uri: graphqlUri,
  // Custom fetch — do not use fetchOptions.timeout (invalid for undici / causes noisy TimeoutError)
  fetch: createTimedFetch(20_000),
  fetchOptions: {
    next: { revalidate: 1800 },
  },
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
  },
}));

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        portfolios: {
          keyArgs: false,
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
        newsArticles: {
          keyArgs: false,
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
        events: {
          keyArgs: false,
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Portfolio: { keyFields: ["id"] },
    NewsArticle: { keyFields: ["id"] },
    Event: { keyFields: ["id"] },
  },
});

export const serverApolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export async function executeServerQuery<T>(
  query: Parameters<typeof serverApolloClient.query>[0]["query"],
  variables?: Record<string, unknown>,
): Promise<T> {
  try {
    const { data } = await serverApolloClient.query({
      query,
      variables,
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });
    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("GraphQL query failed:", message, "→", graphqlUri);
    return null as T;
  }
}
