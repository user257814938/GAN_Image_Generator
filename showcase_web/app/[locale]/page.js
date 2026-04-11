import GeneratePanel from "../../components/generate-panel";
import LanguageSwitcher from "../../components/language-switcher";
import { galleryImages } from "../../data/gallery";
import { defaultLocale, getTranslation, locales } from "../../data/translations";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const copy = getTranslation(locale);

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
  };
}

export default async function LocalePage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const copy = getTranslation(locale ?? defaultLocale);
  const initialImage = galleryImages[0] ?? null;
  const currentYear = new Date().getFullYear();
  const nextLocale =
    locale === "us"
      ? {
          value: "fr",
          flagSrc: "/flags/fr.svg",
          ariaLabel: copy.footer.languageNames.fr,
        }
      : {
          value: "us",
          flagSrc: "/flags/us.svg",
          ariaLabel: copy.footer.languageNames.us,
        };

  return (
    <main className="page-shell" id="top">
      <section className="hero">
        <span className="eyebrow">{copy.hero.eyebrow}</span>
        <h1>{copy.hero.title}</h1>
        <p>{copy.hero.description}</p>
      </section>

      <GeneratePanel images={galleryImages} initialImage={initialImage} copy={copy} />

      <footer className="site-footer">
        <div className="footer-brand">
          <a className="footer-logo-link" href={`/${locale}`} aria-label="Back to top">
            <img className="footer-logo" src="/icon.svg" alt="Osso Website" />
          </a>
          <div className="footer-copy">
            <p className="footer-title">classicGAN</p>
          </div>
        </div>

        <div className="footer-center">
          <p className="footer-meta">{copy.footer.contactLabel}</p>
          <p className="footer-meta">
            <a href="mailto:brian@osso.website">brian@osso.website</a>
          </p>
        </div>

        <div className="footer-side">
          <LanguageSwitcher nextLocale={nextLocale} ariaLabel={copy.footer.languageLabel} />
          <p className="footer-meta">
            {copy.footer.builtBy}{" "}
            <a href="https://osso.website" target="_blank" rel="noreferrer">
              Osso Website
            </a>
          </p>
          <p className="footer-meta">© {currentYear} {copy.footer.copyrightName}</p>
        </div>
      </footer>
    </main>
  );
}
