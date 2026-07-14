"use client";

import { ReactNode, useEffect, useState } from "react";
import ApolloProviderInner from "./ApolloProviderInner";

/**
 * SSR path: render children immediately so the HTML paints (FCP).
 * Client path: wrap with Apollo after mount — ApolloProvider calls useContext,
 * which crashes during Next static prerender if run on the server.
 */
export default function ApolloClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <ApolloProviderInner>{children}</ApolloProviderInner>;
}
