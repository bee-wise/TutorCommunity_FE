"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@workspace/core/configs/tanstack-client";
import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { BeeToaster } from "@workspace/ui/components/ui/bee-toast";
import { RouteTracker } from "./route-tracker";
import { AuthBootstrap } from "./AuthBootstrap";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap />
        {children}
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        <BeeToaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
