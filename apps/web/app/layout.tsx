import { Geist, Geist_Mono } from "next/font/google";

import "@gtdraw/ui/globals.css";
import { Providers } from "@/components/providers";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <UserStoreProvider>
          <TanstackQueryProvider>
            <Providers>{children}</Providers>
          </TanstackQueryProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
