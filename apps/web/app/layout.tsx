import { Geist, Geist_Mono } from "next/font/google";

import "@gtdraw/ui/globals.css";
import { Providers } from "@/components/providers";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";
import { ModeToggle } from "@/components/DarkModeToggle";
import { Toaster } from "@gtdraw/ui/components/sonner";
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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased overflow-hidden m-0 p-0`}
      >
        <UserStoreProvider>
          <TanstackQueryProvider>
            <Providers>
              {children}
              <Toaster position="top-center" />
            </Providers>
          </TanstackQueryProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
