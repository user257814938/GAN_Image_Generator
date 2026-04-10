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

function randomSeed() {
  return Math.floor(Math.random() * 1_000_000_000);
}

export default function GeneratePanel({ initialState, metricsPreview }) {
  const [numImages, setNumImages] = useState(16);
  const [seed, setSeed] = useState(() => randomSeed());
  const [lastUsedSeed, setLastUsedSeed] = useState(null);
  const [imageName, setImageName] = useState(
    initialState.hasImage ? initialState.defaultImageName : null,
  );
  const [updatedAt, setUpdatedAt] = useState(initialState.imageUpdatedAt);
  const [status, setStatus] = useState(
    initialState.hasCheckpoint
      ? "Checkpoint detecte. Tu peux lancer une nouvelle generation."
      : "Aucun checkpoint trouve dans classicGAN/checkpoints/last.pt.",
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const imageUrl = useMemo(() => buildImageUrl(imageName, updatedAt), [imageName, updatedAt]);

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    setStatus("Generation en cours...");

    const submittedSeed = seed;

    startTransition(async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numImages,
            seed: submittedSeed,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "La generation a echoue.");
        }

        setImageName(payload.imageName);
        setUpdatedAt(payload.updatedAt);
        setLastUsedSeed(payload.seed ?? submittedSeed);
        setSeed(randomSeed());
        setStatus(payload.message);
      } catch (err) {
        setError(err.message);
        setStatus("La generation a echoue.");
      }
    });
  }

  return (
    <section className="grid">
      <aside className="panel controls">
        <h2>Controle rapide</h2>
        <p>
          Le bouton ci-dessous execute <code>python generate.py</code> dans le dossier
          <code> classicGAN</code>.
        </p>

        <form className="form-grid" onSubmit={handleGenerate}>
          <div className="field">
            <label htmlFor="num-images">Nombre d&apos;images dans la grille</label>
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
            <p className="field-help">
              Seed = valeur qui controle le hasard de generation. Si le seed change, l&apos;image
              generee change aussi. Un nouveau seed aleatoire est prepare automatiquement apres
              chaque generation.
            </p>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setSeed(randomSeed())}
              disabled={isPending}
            >
              Generer un seed aleatoire
            </button>
          </div>

          <button className="primary-button" type="submit" disabled={isPending || !initialState.hasCheckpoint}>
            {isPending ? "Generation..." : "Generer une nouvelle image"}
          </button>
        </form>

        <p className={`status${error ? " error" : ""}`}>{error || status}</p>

        <div className="badge-row">
          <span className="badge">Prochain seed: {seed}</span>
          {lastUsedSeed !== null ? <span className="badge">Dernier seed: {lastUsedSeed}</span> : null}
        </div>

        {metricsPreview ? (
          <p className="meta-line">
            Derniere ligne de metriques : <code>{metricsPreview}</code>
          </p>
        ) : null}
      </aside>

      <section className="panel viewer">
        <div className="toolbar">
          <div>
            <h2>Derniere image generee</h2>
            <p>Le rendu est recharge a chaque generation avec un parametre anti-cache.</p>
          </div>

          <div className="badge-row">
            <span className="badge">Checkpoint: {initialState.hasCheckpoint ? "ok" : "absent"}</span>
            <span className="badge">Fichier: {imageName ?? "aucun"}</span>
            {imageUrl ? (
              <a className="secondary-button" href={imageUrl} target="_blank" rel="noreferrer">
                Ouvrir l&apos;image
              </a>
            ) : null}
          </div>
        </div>

        <div className="image-frame">
          {imageUrl ? (
            <img src={imageUrl} alt="Grille generee par le modele GAN" />
          ) : (
            <div className="image-placeholder">
              <h3>Aucune image affichable pour l&apos;instant.</h3>
              <p>
                Assure-toi d&apos;avoir un checkpoint dans <code>classicGAN/checkpoints/last.pt</code>,
                puis lance une generation depuis ce panneau.
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
