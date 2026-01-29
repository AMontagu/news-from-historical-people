export type Language = "fr" | "en";

export const translations = {
  fr: {
    title: "Hot Takes de l'Histoire",
    subtitle: "Des personnages historiques réagissent à l'actualité",
    newStory: "Autre actu",
    copyQuote: "Copier",
    copied: "Copié !",
    tryAnother: "Essayer un autre personnage :",
    footer: "Propulsé par Google Gemini AI • Actualités de NewsAPI.org",
    errorLoad: "Impossible de charger les actualités. Veuillez rafraîchir la page.",
    errorGenerate: "Impossible de générer la réaction. Veuillez réessayer.",
  },
  en: {
    title: "Hot Takes From History",
    subtitle: "Historical figures react to today's news",
    newStory: "New Story",
    copyQuote: "Copy Quote",
    copied: "Copied!",
    tryAnother: "Try another perspective:",
    footer: "Powered by Google Gemini AI • News from NewsAPI.org",
    errorLoad: "Failed to load news. Please refresh the page.",
    errorGenerate: "Failed to generate hot take. Please try again.",
  },
} as const;

export function getTranslations(lang: Language) {
  return translations[lang];
}
