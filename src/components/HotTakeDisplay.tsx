import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CornerFlourish, WaxSeal, Quill } from "@/components/decorations";
import { type NewsArticle, type DynamicFigure } from "@/lib/api";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";

interface Translations {
  newStory: string;
  copyQuote: string;
  copied: string;
  loading: string;
  loadingAlt: string;
  loadingQuote: string;
  gazette: string;
  proclamation: string;
}

interface HotTakeDisplayProps {
  figure: DynamicFigure | null;
  article: NewsArticle | null;
  hotTake: string | null;
  loading: boolean;
  onNewStory: () => void;
  translations: Translations;
}

export function HotTakeDisplay({
  figure,
  article,
  hotTake,
  loading,
  onNewStory,
  translations: t,
}: HotTakeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!hotTake || !figure || !article) return;

    const textToCopy = `${figure.name} on "${article.title}":\n\n"${hotTake}"`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initial loading state (full page load)
  if (loading && !figure) {
    return (
      <Card className="animate-unfurl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-[var(--parchment-dark)] rounded animate-pulse w-24" />
            <div className="h-8 bg-[var(--parchment-dark)] rounded animate-pulse w-24" />
          </div>
          <div className="h-5 bg-[var(--parchment-dark)] rounded animate-pulse w-full mb-6" />

          <div className="flex flex-col items-center py-8">
            <div className="portrait-frame mb-4">
              <div className="portrait-frame-inner w-20 h-20">
                <Quill className="w-10 h-10 text-[var(--ink-brown)]" animated />
              </div>
            </div>
            <p className="font-headline text-lg text-[var(--ink-brown)] mb-2 animate-pulse">
              {t.loading}
            </p>
            <p className="font-body text-sm text-[var(--ink-brown-light)] italic">
              {t.loadingAlt}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state while switching character (has figure, generating quote)
  if (loading && figure) {
    return (
      <Card className="overflow-hidden animate-unfurl">
        <CardContent className="p-0">
          {article && (
            <div className="gazette-header p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-ui tracking-wider opacity-80">
                  {article.source.name}
                </p>
                <Button
                  variant="parchment"
                  size="sm"
                  onClick={onNewStory}
                  disabled={true}
                  className="gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t.newStory}
                </Button>
              </div>
              <p className="font-body font-normal text-2xl sm:text-3xl lg:text-4xl">{article.title}</p>
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="portrait-frame mb-4">
                <div className="portrait-frame-inner w-20 h-20">
                  <span className="text-5xl">{figure.avatar}</span>
                </div>
              </div>
              <p className="font-headline font-semibold text-xl text-[var(--ink-brown)]">{figure.name}</p>
              <p className="font-body text-sm text-[var(--ink-brown-light)] italic mb-6">{figure.title}</p>

              <div className="flex items-center gap-2 mb-4">
                <Quill className="w-5 h-5 text-[var(--ink-brown)]" animated />
                <span className="font-body text-[var(--ink-brown-light)] italic">{t.loadingQuote}</span>
              </div>

              <div className="space-y-2 w-full max-w-md">
                <div className="h-4 bg-[var(--parchment-dark)] rounded animate-pulse w-full" />
                <div className="h-4 bg-[var(--parchment-dark)] rounded animate-pulse w-5/6 mx-auto" />
                <div className="h-4 bg-[var(--parchment-dark)] rounded animate-pulse w-4/6 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display the quote
  if (figure && article && hotTake) {
    return (
      <Card className="overflow-hidden animate-unfurl">
        <CardContent className="p-0">
          {/* Gazette Header */}
          <div className="gazette-header p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-ui tracking-wider opacity-80">
                {article.source.name}
              </p>
              <Button
                variant="parchment"
                size="sm"
                onClick={onNewStory}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {t.newStory}
              </Button>
            </div>
            <p className="font-body font-normal text-2xl sm:text-3xl lg:text-4xl">{article.title}</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Portrait with frame and wax seal */}
              <div className="relative mb-6">
                <div className="portrait-frame">
                  <div className="portrait-frame-inner w-24 h-24">
                    <span className="text-6xl">{figure.avatar}</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <WaxSeal letter={figure.name.charAt(0)} size="sm" animated />
                </div>
              </div>

              <p className="font-headline font-bold text-2xl text-[var(--ink-brown)]">{figure.name}</p>
              <p className="font-body text-sm text-[var(--ink-brown-light)] italic mb-6">{figure.title}</p>

              {/* Proclamation Quote Box */}
              <div className="relative w-full max-w-lg proclamation animate-ink-appear">
                <CornerFlourish position="top-left" className="text-[var(--ink-brown)] opacity-40" />
                <CornerFlourish position="top-right" className="text-[var(--ink-brown)] opacity-40" />
                <CornerFlourish position="bottom-left" className="text-[var(--ink-brown)] opacity-40" />
                <CornerFlourish position="bottom-right" className="text-[var(--ink-brown)] opacity-40" />

                <div className="relative px-4">
                  <span className="decorative-quote absolute -left-2 -top-6 text-5xl sm:text-6xl">"</span>
                  <p className="font-body text-2xl sm:text-3xl leading-relaxed text-[var(--ink-black)] py-4">
                    {hotTake}
                  </p>
                  <span className="decorative-quote absolute -right-2 -bottom-8 text-5xl sm:text-6xl">"</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="mt-8 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-700" />
                    <span className="font-ui">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="font-ui">{t.copyQuote}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback (shouldn't normally reach here after initial load)
  return null;
}
