import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import {APP_NAME, APP_DESRIPTION, SERVER_URL} from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
      template: `%s | e-Commerce`,
      default: APP_NAME,
    },
  description: APP_DESRIPTION,
    metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
      <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
      </ThemeProvider>
      </body>
    </html>
  );
}
