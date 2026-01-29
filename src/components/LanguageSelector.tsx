import { Button } from "@/components/ui/button";
import { type Language } from "@/lib/i18n";

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant={language === "fr" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("fr")}
        className="px-2 text-xs"
      >
        FR
      </Button>
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("en")}
        className="px-2 text-xs"
      >
        EN
      </Button>
    </div>
  );
}
