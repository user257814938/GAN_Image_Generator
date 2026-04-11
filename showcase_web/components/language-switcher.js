"use client";

import { useRouter } from "next/navigation";

export default function LanguageSwitcher({ nextLocale, ariaLabel }) {
  const router = useRouter();

  return (
    <div className="language-switcher" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className="language-flag-button"
        onClick={() => router.push(`/${nextLocale.value}`)}
        aria-label={ariaLabel}
        title={nextLocale.ariaLabel}
      >
        <img className="language-flag-image" src={nextLocale.flagSrc} alt="" aria-hidden="true" />
      </button>
    </div>
  );
}
