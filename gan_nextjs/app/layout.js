import "./globals.css";

export const metadata = {
  title: "classicGAN Showcase",
  description: "Demonstrateur Next.js statique pour presenter des generations d'images sur Vercel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
