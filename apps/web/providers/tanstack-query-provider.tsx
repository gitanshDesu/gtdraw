"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, type ReactNode } from "react";

//Since nextjs is serverless (we have to create queryclient per request so to do that we need to do this)

export function TanstackQueryProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<QueryClient | null>(null);
  if (clientRef.current === null) {
    clientRef.current = new QueryClient();
  }
  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
