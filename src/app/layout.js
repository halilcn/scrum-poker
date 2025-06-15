import { Toaster } from "@/components/ui/sonner"

import "./globals.css";

export const metadata = {
  title: "Scrum Poker",
  description:
    "Planning poker için ekip arkadaşlarınızla birlikte tahmin yapın",
  icons: {
    icon: "/favicon.png",
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
