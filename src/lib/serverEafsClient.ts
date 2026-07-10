import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const eafsHttpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_EAFS_API ||
    process.env.NEXT_PUBLIC_API ||
    "http://localhost:1337/graphql",
  fetchOptions: {
    next: { revalidate: 3600 },
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
    });
    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("EAFS GraphQL query error:", message);
    return null as T;
  }
}
