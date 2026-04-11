import GeneratePanel from "@/components/generate-panel";
import { galleryImages } from "@/data/gallery";

export default function Page() {
  const initialImage = galleryImages[0] ?? null;

  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Demonstration IA</span>
        <h1>Decouvrez classicGAN, notre demonstrateur de generation d&apos;images</h1>
        <p>
          classicGAN presente le principe d&apos;un reseau antagoniste generatif : un generateur
          cree de nouvelles images pendant qu&apos;un discriminateur apprend a distinguer les
          rendus synthetiques des exemples reels. Cette interface permet d&apos;explorer rapidement
          differentes sorties du modele pour illustrer le potentiel d&apos;un demonstrateur visuel
          fonde sur l&apos;IA generative.
        </p>
      </section>

      <GeneratePanel images={galleryImages} initialImage={initialImage} />
    </main>
  );
}
