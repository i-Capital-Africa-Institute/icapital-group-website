"use client";

import { ReactNode, useEffect, useState } from "react";
import ApolloEafsProviderInner from "./ApolloEafsProviderInner";

/** Same SSR-safe pattern as the main Apollo provider. */
export default function ApolloEafsProvider({
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

  return <ApolloEafsProviderInner>{children}</ApolloEafsProviderInner>;
}
