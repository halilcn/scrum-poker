import { Toaster } from "@/components/ui/sonner";

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
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
