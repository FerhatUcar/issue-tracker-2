import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { ReactNode } from "react";
import { Container } from "@radix-ui/themes";
import AuthProvider from "@/app/auth/Provider";
import {
  QueryClientProvider,
  RecoilContextProvider,
  ThemeProvider,
} from "@/app/providers";
import { NavbarWrapper } from "@/app/components";
// import dynamic from "next/dynamic";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cookies } from "next/headers";

// const PushNotifications = dynamic(
//   () => import("@/app/components/PushNotificationInitializer"),
//   { ssr: false },
// );

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Rocket issues",
  description: "Offline-ready PWA for your issues",
  manifest: "/manifest.json",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  const cookie = cookies().get("ri.theme")?.value;
  // "light" | "dark" | undefined
  const appearance =
    cookie === "light" || cookie === "dark" ? cookie : undefined;

  return (
    <html lang="en" className={appearance ? appearance : ""}>
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/192x192.png" />
        <link rel="icon" href="/192x192.png" />
        <title>Rocket issues</title>
      </head>
      <body className={inter.variable}>
        <QueryClientProvider>
          <AuthProvider>
            <RecoilContextProvider>
              <ThemeProvider>
                {/*<PushNotifications />*/}
                <NavbarWrapper />
                <main>
                  <Container className="p-5">{children}</Container>
                </main>
              </ThemeProvider>
            </RecoilContextProvider>
          </AuthProvider>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
