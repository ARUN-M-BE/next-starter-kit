"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Track } from "./MusicPlayer";

interface MusicSearchEngineProps {
  onTracksScraped: (tracks: Track[], provider: string) => void;
}

export function MusicSearchEngine({ onTracksScraped }: MusicSearchEngineProps) {
  const [query, setQuery] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);

  const handleCrawlSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a song title or artist query");
      return;
    }

    setIsCrawling(true);
    const crawlToastId = toast.loading(`Scraping music indexes for "${query}" using Firecrawl...`);
    
    try {
      const res = await fetch("/api/music/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to crawl music indexes");

      if (data.tracks && data.tracks.length > 0) {
        onTracksScraped(data.tracks, data.provider);
        toast.success(`Successfully crawled ${data.tracks.length} tracks online!`, {
          id: crawlToastId,
        });
        setQuery("");
      } else {
        toast.error("No crawl results returned from Firecrawl", {
          id: crawlToastId,
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to scrap indexes", {
        id: crawlToastId,
      });
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <Card className="border-border/60 shadow-lg glass bg-card/65 text-left animate-slide-up">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2 text-primary">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <CardTitle className="text-lg font-bold">Firecrawl Music Scraper</CardTitle>
        </div>
        <CardDescription>
          Enter a song query to crawl public webs (Wikipedia, lyrics nodes) and scrap metadata into your playlist.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCrawlSearch} className="space-y-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              placeholder="e.g. Bohemian Rhapsody Queen, Synthwave Beat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/60"
              disabled={isCrawling}
            />
          </div>
          <Button type="submit" disabled={isCrawling} className="w-full h-11 font-semibold rounded-xl flex items-center justify-center">
            {isCrawling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Crawling Web Indexes...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4.5 w-4.5" />
                Scrape with Firecrawl
              </>
            )}
          </Button>

          <div className="flex items-start space-x-2 bg-primary/5 border border-primary/10 rounded-xl p-3 text-2xs text-muted-foreground leading-relaxed mt-2">
            <AlertCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <p>
              <strong>API Sandbox Active:</strong> If the Firecrawl API key is omitted from your `.env.local`, the server triggers highly realistic simulated crawled outputs to safeguard sandbox usage limits.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
export default MusicSearchEngine;
