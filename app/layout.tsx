import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { ReactNode } from "react";
import { Container } from "@radix-ui/themes";
import AuthProvider from "@/app/auth/Provider";
import { QueryClientProvider, RecoilContextProvider, ThemeProvider } from "@/app/providers";
import { NavbarWrapper } from "@/app/components";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Issue Tracker App",
  description: "Offline-ready PWA voor je issues",
  manifest: "/manifest.json",
};

const RootLayout = async ({ children }: { children: ReactNode }) => (
  <html lang="en">
  <head>
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/192x192.png" />
    <link rel="icon" href="/192x192.png" />
    <title>Issue tracker</title>
  </head>
  <body className={inter.variable}>
  <QueryClientProvider>
    <AuthProvider>
      <RecoilContextProvider>
        <ThemeProvider>
          <NavbarWrapper />
          <main>
            <Container className="p-5">{children}</Container>
          </main>
        </ThemeProvider>
      </RecoilContextProvider>
    </AuthProvider>
  </QueryClientProvider>
  </body>
  </html>
);

export default RootLayout;
