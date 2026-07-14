"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  ListMusic,
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { MusicEqualizer } from "./MusicEqualizer";
import { motion, AnimatePresence } from "framer-motion";

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  description?: string;
  markdownSnippet?: string;
  albumArt?: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  onTrackChange?: (track: Track) => void;
}

export function MusicPlayer({ tracks, onTrackChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = tracks[currentTrackIndex] || null;

  // Handle song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = activeTrack?.url || "";
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Audio play deferred:", err.message));
      } else {
        audioRef.current.pause();
      }
    }
    if (activeTrack && onTrackChange) {
      onTrackChange(activeTrack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, activeTrack]);

  // Handle play/pause toggles
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Audio play failed:", err.message));
    }
    setIsPlaying(!isPlaying);
  };

  // Skip tracks forward
  const skipForward = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  // Skip tracks backward
  const skipBackward = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
  };

  // Format track duration seconds
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Audio lifecycle bindings
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 180); // Fallback to 3 mins if duration is Infinity/NaN
    }
  };

  const onAudioEnded = () => {
    skipForward();
  };

  // Handle progress slide transitions
  const handleProgressChange = (val: any) => {
    const targetValue = Array.isArray(val) ? val[0] : val;
    if (audioRef.current) {
      audioRef.current.currentTime = targetValue;
      setCurrentTime(targetValue);
    }
  };

  // Handle volume changes
  const handleVolumeChange = (val: any) => {
    const targetValue = Array.isArray(val) ? val[0] : val;
    setVolume(targetValue);
    if (audioRef.current) {
      audioRef.current.volume = targetValue;
    }
    setIsMuted(targetValue === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const targetMute = !isMuted;
      setIsMuted(targetMute);
      audioRef.current.muted = targetMute;
    }
  };

  return (
    <Card className="border-border/60 shadow-xl overflow-hidden glass bg-card/65 text-left animate-slide-up">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
      />

      <CardContent className="p-6 space-y-6">
        <Tabs defaultValue="player" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 rounded-xl">
            <TabsTrigger value="player" className="rounded-lg flex items-center justify-center">
              <Music className="h-4 w-4 mr-1.5" /> Player
            </TabsTrigger>
            <TabsTrigger value="playlist" className="rounded-lg flex items-center justify-center">
              <ListMusic className="h-4 w-4 mr-1.5" /> Track List
            </TabsTrigger>
            <TabsTrigger value="lyrics" className="rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 mr-1.5" /> Lyrics (Scraped)
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PLAYER CARD CONTROLS */}
          <TabsContent value="player" className="space-y-6 outline-none">
            {/* Visual Equalizer */}
            <MusicEqualizer isPlaying={isPlaying} />

            {/* Album Cover & Titles */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-primary-foreground shadow-lg shrink-0 overflow-hidden border-4 border-card"
              >
                {activeTrack?.albumArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeTrack.albumArt} alt="Album Art" className="h-full w-full object-cover" />
                ) : (
                  <Music className="h-10 w-10 animate-float" />
                )}
              </motion.div>
              <div className="text-center sm:text-left flex-grow min-w-0">
                <h3 className="font-extrabold text-xl truncate">{activeTrack?.title || "No Track Selected"}</h3>
                <p className="text-sm text-muted-foreground truncate">{activeTrack?.artist || "Unknown Artist"}</p>
                {activeTrack?.description && (
                  <div className="inline-flex items-center space-x-1 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full text-2xs text-primary mt-2">
                    <Sparkles className="h-3 w-3" />
                    <span className="truncate max-w-[200px]">{activeTrack.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Progress Slider */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play controls row */}
            <div className="flex items-center justify-center space-x-4">
              <Button variant="ghost" size="icon" onClick={skipBackward} className="h-10 w-10 rounded-xl" title="Previous Track">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button onClick={togglePlay} className="h-14 w-14 rounded-full shadow-lg shadow-primary/25 hover:scale-[1.05] transition-transform">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={skipForward} className="h-10 w-10 rounded-xl" title="Next Track">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume controls */}
            <div className="flex items-center justify-center space-x-3 w-2/3 mx-auto pt-2">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                {isMuted ? <VolumeX className="h-4.5 w-4.5 text-destructive" /> : <Volume2 className="h-4.5 w-4.5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-full cursor-pointer"
              />
            </div>
          </TabsContent>

          {/* TAB 2: TRACK SELECTION LIST */}
          <TabsContent value="playlist" className="space-y-2 max-h-[300px] overflow-y-auto pr-1 outline-none">
            <AnimatePresence initial={false}>
              {tracks.map((track, index) => {
                const isActive = index === currentTrackIndex;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:shadow-sm transition-all ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card/45 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <Music className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-bold truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </div>
                    </div>
                    {isActive && isPlaying && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </TabsContent>

          {/* TAB 3: LYRICS / CRAWLED SNIPPETS */}
          <TabsContent value="lyrics" className="outline-none">
            <div className="p-4 border rounded-xl bg-muted/30 max-h-[300px] overflow-y-auto text-left font-sans leading-relaxed text-sm select-text whitespace-pre-wrap">
              {activeTrack?.markdownSnippet ? (
                <div className="prose prose-sm dark:prose-invert">
                  <p className="font-semibold text-xs text-primary uppercase tracking-wider mb-2">Crawled via Firecrawl API</p>
                  {activeTrack.markdownSnippet}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No lyrics or scraped metadata available for this track. Use the Scraper to crawl details online!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
export default MusicPlayer;
