import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type NewsArticle, type DynamicFigure } from "@/lib/api";
import { Copy, Check, Shuffle } from "lucide-react";
import { useState } from "react";

interface Translations {
  newStory: string;
  copyQuote: string;
  copied: string;
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-8 bg-muted rounded animate-pulse w-24" />
          </div>
          <div className="h-5 bg-muted rounded animate-pulse w-full mb-6" />

          <div className="flex flex-col items-center py-8">
            <div className="text-6xl animate-bounce mb-4">🎭</div>
            <div className="h-5 bg-muted rounded animate-pulse w-40 mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-32 mb-6" />
            <div className="space-y-2 w-full max-w-md">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state while switching character (has figure, generating quote)
  if (loading && figure) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {article && (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {article.source.name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNewStory}
                  disabled={true}
                  className="gap-1.5"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  {t.newStory}
                </Button>
              </div>
              <p className="font-semibold">{article.title}</p>
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl animate-bounce mb-4">{figure.avatar}</div>
              <p className="font-semibold text-lg">{figure.name}</p>
              <p className="text-sm text-muted-foreground mb-6">{figure.title}</p>

              <div className="space-y-2 w-full max-w-md">
                <div className="h-4 bg-muted rounded animate-pulse w-full" />
                <div className="h-4 bg-muted rounded animate-pulse w-5/6 mx-auto" />
                <div className="h-4 bg-muted rounded animate-pulse w-4/6 mx-auto" />
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
      <Card className="overflow-hidden animate-fade-in">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                {article.source.name}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewStory}
                className="gap-1.5"
              >
                <Shuffle className="h-3.5 w-3.5" />
                {t.newStory}
              </Button>
            </div>
            <p className="font-semibold">{article.title}</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">{figure.avatar}</div>
              <p className="font-semibold text-lg">{figure.name}</p>
              <p className="text-sm text-muted-foreground mb-6">{figure.title}</p>

              <div className="relative max-w-lg">
                <div className="absolute -left-4 -top-2 text-5xl text-muted-foreground/20">"</div>
                <p className="text-xl leading-relaxed italic px-6">{hotTake}</p>
                <div className="absolute -right-4 -bottom-2 text-5xl text-muted-foreground/20">"</div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="mt-6 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t.copyQuote}
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
