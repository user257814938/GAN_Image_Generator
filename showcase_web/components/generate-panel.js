"use client";

import { useEffect, useRef, useState } from "react";

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

export default function GeneratePanel({ images = [], initialImage = null, copy }) {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);
  const imageUrl = currentImage?.src ?? null;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handlePickNext() {
    if (!images.length || isLoading) {
      return;
    }

    const nextImage = pickRandomImage(images, currentImage?.src ?? null);
    setIsLoading(true);

    timeoutRef.current = window.setTimeout(() => {
      setCurrentImage(nextImage);
      setIsLoading(false);
      timeoutRef.current = null;
    }, 2000);
  }

  return (
    <section className="grid">
      <aside className="panel controls">
        <h2>{copy.panel.title}</h2>
        <p>{copy.panel.description}</p>

        {currentImage ? (
          <div className="meta-block">
            {currentImage.model ? (
              <p className="meta-line">
                {copy.panel.model} : <code>{currentImage.model}</code>
              </p>
            ) : null}
            {currentImage.seed !== undefined ? (
              <p className="meta-line">
                {copy.panel.seed} : <code>{currentImage.seed}</code>
              </p>
            ) : null}
            {currentImage.dataset ? (
              <p className="meta-line">
                {copy.panel.dataset} : <code>{currentImage.dataset}</code>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="meta-block">
            <p className="meta-line">{copy.panel.emptyTitle}</p>
            <p className="meta-line">{copy.panel.emptyDescription}</p>
          </div>
        )}

        <div className="form-grid">
          <button className="primary-button" type="button" onClick={handlePickNext} disabled={!images.length || isLoading}>
            {!images.length
              ? copy.panel.buttonEmpty
              : isLoading
                ? copy.panel.buttonLoading
                : copy.panel.buttonIdle}
          </button>
        </div>
      </aside>

      <section className="panel viewer">
        <div className="toolbar">
          <div>
            <h2>{copy.viewer.title}</h2>
            <p>{copy.viewer.description}</p>
          </div>

          <div>
            {imageUrl ? (
              <a className="secondary-button" href={imageUrl} target="_blank" rel="noreferrer">
                <svg className="external-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M9.5 2H14v4.5h-1.5V4.56L7.53 9.53 6.47 8.47 11.44 3.5H9.5V2ZM3 3.5h4v1.5H4.5v7h7V9h1.5v4H3v-9.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{copy.viewer.openImage}</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="image-frame">
          {imageUrl ? (
            <>
              <img
                className={isLoading ? "image-loading" : ""}
                src={imageUrl}
                alt={currentImage.title ?? copy.viewer.imageAlt}
              />
              {isLoading ? (
                <div className="image-overlay">
                  <span className="loading-pulse" />
                </div>
              ) : null}
            </>
          ) : (
            <div className="image-placeholder">
              <h3>{copy.viewer.placeholderTitle}</h3>
              <p>{copy.viewer.placeholderDescription}</p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
