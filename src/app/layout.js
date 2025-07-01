import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

import "./globals.css";

export const metadata = {
  title: "StoriPoi",
  description:
    "Collaborate with your team to make accurate story point estimates using planning poker",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N546CGG9L7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N546CGG9L7');
          `}
        </Script>

        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
