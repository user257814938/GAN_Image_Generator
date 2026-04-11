import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://image.osso.website"),
  title: "classicGAN | Démonstrateur de génération d'images",
  description: "Démonstrateur professionnel de génération d'images fondé sur un GAN.",
  openGraph: {
    title: "classicGAN | Démonstrateur de génération d'images",
    description: "Démonstrateur professionnel de génération d'images fondé sur un GAN.",
    siteName: "classicGAN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "classicGAN par Osso Website",
      },
    ],
  },
  icons: {
    icon: "/icon.svg",
  },
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
