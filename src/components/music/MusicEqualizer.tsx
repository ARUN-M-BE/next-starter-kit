"use client";

import { motion } from "framer-motion";

interface MusicEqualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export function MusicEqualizer({ isPlaying, barCount = 15, className = "" }: MusicEqualizerProps) {
  // Generate random heights for animation variants
  const getVariants = (delay: number) => ({
    animate: {
      height: isPlaying ? [10, 50, 15, 60, 20, 45, 10] : 8,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const,
        delay: delay,
      },
    },
  });

  const bars = Array.from({ length: barCount });

  return (
    <div className={`flex items-end justify-center gap-1.5 h-16 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden ${className}`}>
      {bars.map((_, index) => {
        const delay = index * 0.1;
        const variants = getVariants(delay);

        return (
          <motion.div
            key={index}
            variants={variants}
            animate="animate"
            className="w-1.5 bg-gradient-to-t from-primary via-indigo-500 to-violet-500 rounded-full"
            style={{ originY: 1 }}
          />
        );
      })}
    </div>
  );
}
export default MusicEqualizer;
