import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  title: "classicGAN | Demonstrateur IA",
  description: "Demonstrateur professionnel de generation d'images fonde sur un GAN.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
