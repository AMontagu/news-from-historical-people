export type Language = "fr" | "en";

export const translations = {
  fr: {
    title: "Chroniques du Passé",
    subtitle: "Où les esprits d'antan commentent les nouvelles d'aujourd'hui",
    newStory: "Autre Gazette",
    copyQuote: "Copier la Missive",
    copied: "Transcrit !",
    tryAnother: "Consulter un autre esprit :",
    footer: "Transcrit par Ye Olde Oracle Mécanique • Nouvelles du Royaume",
    errorLoad: "Hélas ! Les pigeons voyageurs se sont égarés.",
    errorGenerate: "Les esprits refusent de se manifester. Réessayez.",
    loading: "Invocation des esprits d'antan...",
    loadingAlt: "Dépêchement du pigeon voyageur...",
    loadingQuote: "L'encre sèche sur le parchemin...",
    established: "Est. MDCCLXXVI",
    proclamation: "PROCLAMATION",
    gazette: "LA GAZETTE DES SIÈCLES",
  },
  en: {
    title: "Chronicles of Yore",
    subtitle: "Where spirits of old opine upon today's tidings",
    newStory: "New Gazette",
    copyQuote: "Copy Missive",
    copied: "Transcribed!",
    tryAnother: "Consult another spirit:",
    footer: "Transcribed by Ye Mechanical Oracle • Tidings from the Realm",
    errorLoad: "Alas! The carrier pigeons have gone astray.",
    errorGenerate: "The spirits refuse to manifest. Pray try again.",
    loading: "Summoning spirits of old...",
    loadingAlt: "Dispatching carrier pigeon...",
    loadingQuote: "The ink dries upon the parchment...",
    established: "Est. MDCCLXXVI",
    proclamation: "PROCLAMATION",
    gazette: "THE GAZETTE OF AGES",
  },
} as const;

export function getTranslations(lang: Language) {
  return translations[lang];
}
