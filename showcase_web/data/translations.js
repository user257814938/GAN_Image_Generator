export const locales = ["us", "fr"];

export const defaultLocale = "us";

export const translations = {
  us: {
    metadata: {
      title: "classicGAN | Image generation demo",
      description: "Professional image generation demo built around a GAN.",
    },
    hero: {
      eyebrow: "Image generation",
      title: "Discover the classicGAN image generation demo",
      description: "classicGAN showcases how a GAN can generate new images from a learned latent space.",
    },
    panel: {
      title: "Image generation studio",
      description: "Explore different classicGAN outputs to quickly review the variety of generated images.",
      model: "Model",
      seed: "Seed",
      dataset: "Dataset",
      emptyTitle: "No image is available yet.",
      emptyDescription: "The gallery will be updated as soon as new images are added.",
      buttonIdle: "Generate a new image",
      buttonLoading: "Loading image...",
      buttonEmpty: "Gallery unavailable",
    },
    viewer: {
      title: "Preview",
      description: "View a generated image and open it in a larger format when needed.",
      openImage: "Open image",
      imageAlt: "classicGAN demo image",
      placeholderTitle: "Gallery in progress.",
      placeholderDescription: "New images will complete this demonstration soon.",
    },
    footer: {
      contactLabel: "Contact us",
      builtBy: "Built by",
      languageLabel: "Language",
      copyrightName: "classicGAN",
      languageNames: {
        us: "English",
        fr: "Français",
      },
    },
  },
  fr: {
    metadata: {
      title: "classicGAN | Démonstrateur de génération d'images",
      description: "Démonstrateur professionnel de génération d'images fondé sur un GAN.",
    },
    hero: {
      eyebrow: "Génération d'images",
      title: "Découvrez le démonstrateur de génération d'images classicGAN",
      description: "classicGAN illustre le fonctionnement d'un GAN capable de produire de nouvelles images à partir d'un espace latent appris.",
    },
    panel: {
      title: "Studio de génération d'images",
      description: "Explorez différentes sorties de classicGAN pour observer rapidement la variété des images générées.",
      model: "Modèle",
      seed: "Seed",
      dataset: "Dataset",
      emptyTitle: "Aucune image n'est disponible pour le moment.",
      emptyDescription: "La galerie sera mise à jour dès que de nouvelles images seront ajoutées.",
      buttonIdle: "Générer une nouvelle image",
      buttonLoading: "Chargement de l'image...",
      buttonEmpty: "Galerie indisponible",
    },
    viewer: {
      title: "Aperçu",
      description: "Visualisez une image générée par le modèle et ouvrez-la en grand format si nécessaire.",
      openImage: "Ouvrir l'image",
      imageAlt: "Image de démonstration classicGAN",
      placeholderTitle: "Galerie en préparation.",
      placeholderDescription: "Les prochaines images viendront compléter cette démonstration.",
    },
    footer: {
      contactLabel: "Contact us",
      builtBy: "Built by",
      languageLabel: "Langue",
      copyrightName: "classicGAN",
      languageNames: {
        us: "English",
        fr: "Français",
      },
    },
  },
};

export function getTranslation(locale) {
  return translations[locale] ?? translations[defaultLocale];
}
