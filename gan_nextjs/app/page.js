import GeneratePanel from "@/components/generate-panel";
import { galleryImages } from "@/data/gallery";

export default function Page() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">classicGAN Showcase</span>
        <h1>Une galerie de demonstration prete pour Vercel.</h1>
        <p>
          Cette version sert des images statiques depuis <code>public/generated</code> et choisit
          un rendu aleatoire dans la galerie. Elle est concue pour un sous-domaine public comme
          <code> image.osso.website</code>.
        </p>
      </section>

      <GeneratePanel images={galleryImages} />
    </main>
  );
}
