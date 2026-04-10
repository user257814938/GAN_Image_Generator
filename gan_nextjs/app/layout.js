import "./globals.css";

export const metadata = {
  title: "GAN Generator",
  description: "Interface Next.js pour générer des images depuis le checkpoint PyTorch local.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
