"use client";

import { useMemo, useState, useTransition } from "react";

function buildImageUrl(name, updatedAt) {
  if (!name) {
    return null;
  }

  const params = new URLSearchParams({
    name,
    ts: String(updatedAt ?? Date.now()),
  });
  return `/api/image?${params.toString()}`;
}

export default function GeneratePanel({ initialState, metricsPreview }) {
  const [numImages, setNumImages] = useState(16);
  const [seed, setSeed] = useState(42);
  const [imageName, setImageName] = useState(
    initialState.hasImage ? initialState.defaultImageName : null,
  );
  const [updatedAt, setUpdatedAt] = useState(initialState.imageUpdatedAt);
  const [status, setStatus] = useState(
    initialState.hasCheckpoint
      ? "Checkpoint détecté. Tu peux lancer une nouvelle génération."
      : "Aucun checkpoint trouvé dans course_gan/checkpoints/last.pt.",
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const imageUrl = useMemo(() => buildImageUrl(imageName, updatedAt), [imageName, updatedAt]);

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    setStatus("Génération en cours...");

    startTransition(async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numImages,
            seed,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "La génération a échoué.");
        }

        setImageName(payload.imageName);
        setUpdatedAt(payload.updatedAt);
        setStatus(payload.message);
      } catch (err) {
        setError(err.message);
        setStatus("La génération a échoué.");
      }
    });
  }

  return (
    <section className="grid">
      <aside className="panel controls">
        <h2>Contrôle rapide</h2>
        <p>
          Le bouton ci-dessous exécute <code>python generate.py</code> dans le dossier
          <code> course_gan</code>.
        </p>

        <form className="form-grid" onSubmit={handleGenerate}>
          <div className="field">
            <label htmlFor="num-images">Nombre d’images dans la grille</label>
            <input
              id="num-images"
              type="number"
              min="1"
              max="64"
              value={numImages}
              onChange={(event) => setNumImages(Number(event.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="seed">Seed</label>
            <input
              id="seed"
              type="number"
              value={seed}
              onChange={(event) => setSeed(Number(event.target.value))}
            />
          </div>

          <button className="primary-button" type="submit" disabled={isPending || !initialState.hasCheckpoint}>
            {isPending ? "Génération..." : "Générer une nouvelle image"}
          </button>
        </form>

        <p className={`status${error ? " error" : ""}`}>{error || status}</p>

        {metricsPreview ? (
          <p className="meta-line">
            Dernière ligne de métriques : <code>{metricsPreview}</code>
          </p>
        ) : null}
      </aside>

      <section className="panel viewer">
        <div className="toolbar">
          <div>
            <h2>Dernière image générée</h2>
            <p>Le rendu est rechargé à chaque génération avec un paramètre anti-cache.</p>
          </div>

          <div className="badge-row">
            <span className="badge">Checkpoint: {initialState.hasCheckpoint ? "ok" : "absent"}</span>
            <span className="badge">Fichier: {imageName ?? "aucun"}</span>
            {imageUrl ? (
              <a className="secondary-button" href={imageUrl} target="_blank" rel="noreferrer">
                Ouvrir l’image
              </a>
            ) : null}
          </div>
        </div>

        <div className="image-frame">
          {imageUrl ? (
            <img src={imageUrl} alt="Grille générée par le modèle GAN" />
          ) : (
            <div className="image-placeholder">
              <h3>Aucune image affichable pour l’instant.</h3>
              <p>
                Assure-toi d’avoir un checkpoint dans <code>course_gan/checkpoints/last.pt</code>,
                puis lance une génération depuis ce panneau.
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
