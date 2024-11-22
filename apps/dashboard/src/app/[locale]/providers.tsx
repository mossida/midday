"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { I18nProviderClient } from "@/locales/client";
import { TriggerProvider } from "@trigger.dev/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ locale, children }: ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProviderClient locale={locale}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TriggerProvider
            publicApiKey={process.env.NEXT_PUBLIC_TRIGGER_API_KEY!}
            apiUrl={process.env.NEXT_PUBLIC_TRIGGER_API_URL}
          >
            {children}
          </TriggerProvider>
        </ThemeProvider>
      </I18nProviderClient>
    </QueryClientProvider>
  );
}
