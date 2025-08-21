import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/contexts/theme-context";
import { Navbar } from "@/components/navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProKvartiru.kz - Отзывы о недвижимости и арендаторах",
  description: "Сайт о недвижимости, арендаторах и арендодателях.",
  // "Платформа для отзывов о недвижимости и арендаторах в Казахстане",
};

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground mt-12 py-8 px-4 text-sm">
      <div className="container mx-auto flex flex-col gap-2 items-center text-center">
        <div>© 2025 ProKvartiru.kz. Все права защищены.</div>
        <div>
          Использование материалов сайта без письменного разрешения автора
          запрещено.
        </div>
        <div>
          Сайт, дизайн, контент и программный код защищены авторским правом в
          соответствии с законодательством Республики Казахстан.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "dark:bg-card dark:text-card-foreground dark:border-border",
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
