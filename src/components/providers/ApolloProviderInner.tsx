"use client";

import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { useMemo, ReactNode } from "react";

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API,
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          portfolios: {
            keyArgs: false,
            merge(_existing, incoming) {
              return incoming;
            },
          },
          newsArticles: {
            keyArgs: false,
            merge(_existing, incoming) {
              return incoming;
            },
          },
          events: {
            keyArgs: false,
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Portfolio: { keyFields: ["id"] },
      NewsArticle: { keyFields: ["id"] },
      Event: { keyFields: ["id"] },
    },
    resultCaching: true,
    possibleTypes: {},
  });

  return new ApolloClient({
    link: httpLink,
    cache,
    ssrMode: typeof window === "undefined",
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
        nextFetchPolicy: "cache-first",
      },
      query: { fetchPolicy: "cache-first", errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  });
}

let browserClient: ApolloClient<unknown> | null = null;

function getClient() {
  // New client per server request — avoids leaking cache across users
  if (typeof window === "undefined") {
    return makeClient();
  }
  if (!browserClient) {
    browserClient = makeClient();
  }
  return browserClient;
}

export default function ApolloProviderInner({
  children,
}: {
  children: ReactNode;
}) {
  const client = useMemo(() => getClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
