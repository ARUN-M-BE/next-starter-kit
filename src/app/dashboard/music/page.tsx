"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MusicPlayer, Track } from "@/components/music/MusicPlayer";
import { MusicSearchEngine } from "@/components/music/MusicSearchEngine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Radio, Sparkles, FolderOpen, Heart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MusicPage() {
  // Pre-populate with beautiful default tracks for direct playback
  const defaultTracks: Track[] = [
    {
      id: "track_default_1",
      title: "Syntax Sunset",
      artist: "Acoustic Nodes",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
      description: "Default premium lo-fi chill trace for programming.",
      markdownSnippet: "### Lyrics (Syntax Sunset)\n\n[Verse 1]\nSun goes down, screen glows bright\nCode compilers run tonight\nVariables align in place\nLost within the syntax space...\n\n[Chorus]\nOh, compilation flow\nWatch the console warning go\nNo more errors in the line\nEverything is building fine..."
    },
    {
      id: "track_default_2",
      title: "Binary Beats",
      artist: "Digital Resonance",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      albumArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80",
      description: "Vibrant high-tempo synthwave compilation.",
      markdownSnippet: "### Lyrics (Binary Beats)\n\n[Chorus]\nZeroes and ones in the line\nDancing till the morning time\nThrough the fiber, hear the call\nWe will compile it all..."
    },
    {
      id: "track_default_3",
      title: "Lo-Fi Coffee Loop",
      artist: "Lo-Fi Compiler",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
      description: "Relaxed jazzy beats for debugging workflows.",
      markdownSnippet: "### Instrumental Track\n\n[Melodious jazz saxophone plays]\n[Smooth vinyl crackle sound effect]\n[Keyboard key clicks in the distance]"
    }
  ];

  const [tracks, setTracks] = useState<Track[]>(defaultTracks);
  const [providerSource, setProviderSource] = useState("Default Playlist");

  const handleTracksScraped = (newTracks: Track[], provider: string) => {
    // Append crawled tracks to play list
    setTracks((prev) => [...newTracks, ...prev]);
    setProviderSource(provider);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-left">
        {/* Page Header */}
        <PageHeader
          title="Music Dashboard"
          description="Play local tracks or crawl the web using Firecrawl to import new lyrics and songs."
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Music Hub" }]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Scraper controls - LHS */}
          <div className="lg:col-span-1 space-y-6">
            <MusicSearchEngine onTracksScraped={handleTracksScraped} />

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="text-left py-4">
                <CardTitle className="text-xs font-semibold text-primary uppercase flex items-center">
                  <Radio className="h-4 w-4 mr-1.5 animate-pulse" /> Playlist Origin
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-left pb-4">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Source Provider:</span>
                  <span className="font-bold text-foreground">{providerSource}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Playlist Size:</span>
                  <span className="font-bold text-foreground">{tracks.length} tracks</span>
                </div>
                <div className="flex items-center space-x-1.5 text-2xs text-muted-foreground pt-1 leading-relaxed">
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-current shrink-0" />
                  <span>Click on any track inside the 'Track List' tab to switch songs.</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive music player - RHS */}
          <div className="lg:col-span-2">
            <MusicPlayer tracks={tracks} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
