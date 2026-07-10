import { ReactNode } from "react";
import ApolloEafsProvider from "@/components/providers/ApolloEafsProvider";

export default function EafsLayout({ children }: { children: ReactNode }) {
  return <ApolloEafsProvider>{children}</ApolloEafsProvider>;
}
