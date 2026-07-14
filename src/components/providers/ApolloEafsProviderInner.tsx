"use client";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { useMemo, ReactNode } from "react";

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_EAFS_API || "http://localhost:1337/graphql",
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          summits: {
            keyArgs: false,
            merge(_existing, incoming) { return incoming; },
          },
          testimonials: {
            keyArgs: false,
            merge(_existing, incoming) { return incoming; },
          },
        },
      },
      Summit:      { keyFields: ["id"] },
      Testimonial: { keyFields: ["id"] },
    },
    resultCaching: true,
  });

  return new ApolloClient({
    link: httpLink,
    cache,
    ssrMode: typeof window === "undefined",
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-first", errorPolicy: "all", nextFetchPolicy: "cache-first" },
      query:       { fetchPolicy: "cache-first", errorPolicy: "all" },
      mutate:      { errorPolicy: "all" },
    },
  });
}

let browserClient: ApolloClient<any> | null = null;

function getClient() {
  if (typeof window === "undefined") {
    return makeClient();
  }
  if (!browserClient) browserClient = makeClient();
  return browserClient;
}

export default function ApolloEafsProviderInner({ children }: { children: ReactNode }) {
  const client = useMemo(() => getClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
