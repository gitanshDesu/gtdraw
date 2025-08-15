import { Geist, Geist_Mono } from "next/font/google";

import "@gtdraw/ui/globals.css";
import { Providers } from "@/components/providers";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";
import { ModeToggle } from "@/components/DarkModeToggle";
import { Toaster } from "@gtdraw/ui/components/sonner";
import { ResetPassStoreProvider } from "@/providers/reset-pass-store-provider";
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
          <ResetPassStoreProvider>
            <TanstackQueryProvider>
              <Providers>
                {children}
                <Toaster position="top-center" />
              </Providers>
            </TanstackQueryProvider>
          </ResetPassStoreProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
