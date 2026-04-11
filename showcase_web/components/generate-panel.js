"use client";

import { useState } from "react";

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

export default function GeneratePanel({ images = [], initialImage = null }) {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const imageUrl = currentImage?.src ?? null;

  function handlePickNext() {
    const nextImage = pickRandomImage(images, currentImage?.src ?? null);
    setCurrentImage(nextImage);
  }

  return (
    <section className="grid">
      <aside className="panel controls">
        <h2>Explorer la collection</h2>
        <p>
          Chaque clic affiche une nouvelle variation issue du modele classicGAN. Cette
          demonstration a ete pensee pour montrer la diversite visuelle que peut produire un GAN
          dans un cadre de presentation client.
        </p>

        <div className="form-grid">
          <button className="primary-button" type="button" onClick={handlePickNext} disabled={!images.length}>
            {images.length ? "Afficher une autre generation" : "Galerie indisponible"}
          </button>

          <p className="field-help">
            Chaque visuel correspond a un point different dans l&apos;espace latent du modele. Le
            changement d&apos;image permet d&apos;observer rapidement l&apos;etendue des rendus que
            cette approche generative peut proposer.
          </p>
        </div>

        <div className="badge-row">
          <span className="badge">Images: {images.length}</span>
          <span className="badge">Modele: classicGAN</span>
          <span className="badge">Generation visuelle</span>
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
            <p className="meta-line">Aucune image n&apos;est disponible pour le moment.</p>
            <p className="meta-line">
              La galerie sera renseignee avec de nouvelles generations des que la prochaine serie
              d&apos;images sera prete.
            </p>
          </div>
        )}
      </aside>

      <section className="panel viewer">
        <div className="toolbar">
          <div>
            <h2>Apercu du modele</h2>
            <p>
              Le rendu ci-dessous illustre une sortie du modele a partir d&apos;une configuration
              latente differente. L&apos;objectif est de montrer la coherence generale et la
              variete des resultats obtenus.
            </p>
          </div>

          <div className="badge-row">
            <span className="badge">Demonstration client</span>
            <span className="badge">IA generative</span>
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
              <h3>Galerie en preparation.</h3>
              <p>
                Les prochaines generations viendront alimenter cette vitrine pour presenter une
                selection representative des capacites du modele.
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
