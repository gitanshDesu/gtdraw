import { Geist, Geist_Mono } from "next/font/google";

import "@gtdraw/ui/globals.css";
import { Providers } from "@/components/providers";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";
import { ModeToggle } from "@/components/DarkModeToggle";
import { SidebarProvider, SidebarTrigger } from "@gtdraw/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased overflow-hidden`}
      >
        <UserStoreProvider>
          <TanstackQueryProvider>
            <Providers>
              <div className="flex justify-end relative top-4 right-4 sm:top-8 sm:right-8">
                <ModeToggle />
              </div>

              {children}
            </Providers>
          </TanstackQueryProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
