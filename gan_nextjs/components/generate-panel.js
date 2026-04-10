"use client";

import { useMemo, useState } from "react";

function pickRandomImage(images, currentSrc = null) {
  if (!images.length) {
    return null;
  }

  if (images.length === 1) {
    return images[0];
  }

  let candidate = images[Math.floor(Math.random() * images.length)];

  while (candidate.src === currentSrc) {
    candidate = images[Math.floor(Math.random() * images.length)];
  }

  return candidate;
}

export default function GeneratePanel({ images = [] }) {
  const [currentImage, setCurrentImage] = useState(() => pickRandomImage(images));
  const [lastPickedAt, setLastPickedAt] = useState(() => Date.now());

  const imageUrl = useMemo(() => {
    if (!currentImage) {
      return null;
    }

    const params = new URLSearchParams({
      ts: String(lastPickedAt),
    });

    return `${currentImage.src}?${params.toString()}`;
  }, [currentImage, lastPickedAt]);

  function handlePickNext() {
    const nextImage = pickRandomImage(images, currentImage?.src ?? null);
    setCurrentImage(nextImage);
    setLastPickedAt(Date.now());
  }

  return (
    <section className="grid">
      <aside className="panel controls">
        <h2>Mode Vercel</h2>
        <p>
          Cette interface n&apos;execute plus Python en ligne. Elle affiche une image aleatoire
          parmi les assets presentes dans <code>gan_nextjs/public/generated</code>.
        </p>

        <div className="form-grid">
          <button className="primary-button" type="button" onClick={handlePickNext} disabled={!images.length}>
            {images.length ? "Afficher une autre image" : "Galerie vide"}
          </button>

          <p className="field-help">
            Ajoute tes PNG dans <code>public/generated</code>, puis declare-les dans
            <code> data/gallery.js</code>. Le site sera ensuite deployable tel quel sur Vercel.
          </p>
        </div>

        <div className="badge-row">
          <span className="badge">Images: {images.length}</span>
          <span className="badge">Modele: classicGAN</span>
          <span className="badge">Mode: statique</span>
        </div>

        {currentImage ? (
          <div className="meta-block">
            <p className="meta-line">
              Titre : <code>{currentImage.title ?? "Sans titre"}</code>
            </p>
            {currentImage.seed !== undefined ? (
              <p className="meta-line">
                Seed : <code>{currentImage.seed}</code>
              </p>
            ) : null}
            {currentImage.dataset ? (
              <p className="meta-line">
                Dataset : <code>{currentImage.dataset}</code>
              </p>
            ) : null}
            {currentImage.model ? (
              <p className="meta-line">
                Variante : <code>{currentImage.model}</code>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="meta-block">
            <p className="meta-line">Aucune image n&apos;est publiee pour l&apos;instant.</p>
            <p className="meta-line">
              Tu pourras remplir la galerie apres le deploiement, ou juste avant, en ajoutant les
              fichiers dans <code>public/generated</code>.
            </p>
          </div>
        )}
      </aside>

      <section className="panel viewer">
        <div className="toolbar">
          <div>
            <h2>Demonstrateur client</h2>
            <p>
              Le rendu ci-dessous est choisi aleatoirement dans une galerie statique optimisee pour
              un deploiement simple sur Vercel.
            </p>
          </div>

          <div className="badge-row">
            <span className="badge">Sous-domaine ready</span>
            <span className="badge">Root: gan_nextjs</span>
            {imageUrl ? (
              <a className="secondary-button" href={imageUrl} target="_blank" rel="noreferrer">
                Ouvrir l&apos;image
              </a>
            ) : null}
          </div>
        </div>

        <div className="image-frame">
          {imageUrl ? (
            <img src={imageUrl} alt={currentImage.title ?? "Image de demonstration classicGAN"} />
          ) : (
            <div className="image-placeholder">
              <h3>Galerie vide pour le moment.</h3>
              <p>
                Le deploiement peut partir tout de suite. Quand tu seras pret, ajoute les images
                dans <code>gan_nextjs/public/generated</code> puis renseigne
                <code> gan_nextjs/data/gallery.js</code>.
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
