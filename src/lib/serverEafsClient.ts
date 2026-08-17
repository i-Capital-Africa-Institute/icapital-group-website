import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { createTimedFetch } from "./fetchWithTimeout";

const eafsUri =
  process.env.NEXT_PUBLIC_EAFS_API ||
  process.env.NEXT_PUBLIC_API ||
  "http://localhost:1337/graphql";

const eafsHttpLink = createHttpLink({
  uri: eafsUri,
  fetch: createTimedFetch(20_000),
  fetchOptions: {
    next: { revalidate: 1800 },
  },
});

export const serverEafsClient = new ApolloClient({
  link: eafsHttpLink,
  cache: new InMemoryCache(),
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export async function executeEafsServerQuery<T>(
  query: Parameters<typeof serverEafsClient.query>[0]["query"],
  variables?: Record<string, unknown>,
): Promise<T> {
  try {
    const { data } = await serverEafsClient.query({
      query,
      variables,
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });
    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("EAFS GraphQL query failed:", message, "→", eafsUri);
    return null as T;
  }
}
