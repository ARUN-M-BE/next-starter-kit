"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl" />;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-xl relative overflow-hidden group hover:bg-primary/10"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative w-5 h-5 transition-transform duration-500 group-hover:rotate-45">
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-500 transition-all duration-300" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-600 transition-all duration-300" />
        )}
      </div>
    </Button>
  );
}
export default ThemeToggle;
