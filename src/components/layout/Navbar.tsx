"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, Shield, Compass, Mail, Home, LayoutDashboard, User, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV_ITEMS } from "@/lib/constants";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name?: string; avatar?: string } | null>(null);

  // Monitor scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simple client-side auth state update from cookie check
  const checkAuth = async () => {
    const cookies = document.cookie.split(";");
    const hasToken = cookies.some((item) => item.trim().startsWith("session_token="));
    setIsAuthenticated(hasToken);

    if (hasToken) {
      try {
        const res = await fetch("/api/auth/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUserProfile({
              name: data.user.name || "User",
              avatar: data.user.avatar || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed fetching profile state for header:", err);
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Successfully logged out");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Get icon for navbar item
  const getNavIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home":
        return <Home className="h-4 w-4 mr-2" />;
      case "dashboard":
        return <LayoutDashboard className="h-4 w-4 mr-2" />;
      case "music hub":
        return <Music className="h-4 w-4 mr-2" />;
      case "maps integration":
        return <Compass className="h-4 w-4 mr-2" />;
      case "contact us":
        return <Mail className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass bg-background/70 shadow-sm border-b"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="h-9 w-9 bg-primary flex items-center justify-center rounded-xl text-primary-foreground shadow-md animate-float">
              <Shield className="h-5 w-5" />
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              StarterKit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => {
              // Hide protected links if not authenticated
              if (item.protected && !isAuthenticated) return null;

              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {getNavIcon(item.label)}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Theme Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarImage src={userProfile?.avatar} alt={userProfile?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userProfile?.name ? userProfile.name.substring(0, 2).toUpperCase() : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl" title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button className="rounded-xl font-semibold shadow-sm hover:scale-[1.02] transition-transform">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="h-6 w-6" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] flex flex-col justify-between">
                <div>
                  <SheetHeader className="text-left mb-6">
                    <SheetTitle className="flex items-center space-x-2">
                      <span className="h-8 w-8 bg-primary flex items-center justify-center rounded-xl text-primary-foreground">
                        <Shield className="h-4 w-4" />
                      </span>
                      <span className="font-extrabold text-lg tracking-tight">StarterKit</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-2">
                    {NAV_ITEMS.map((item) => {
                      if (item.protected && !isAuthenticated) return null;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {getNavIcon(item.label)}
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="border-t pt-4">
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userProfile?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {userProfile?.name ? userProfile.name.substring(0, 2).toUpperCase() : <User className="h-5 w-5" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-semibold truncate max-w-[120px]">{userProfile?.name}</p>
                          <p className="text-xs text-muted-foreground">Authenticated</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => { setIsMobileOpen(false); handleLogout(); }} className="text-destructive hover:bg-destructive/10 rounded-xl">
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsMobileOpen(false)}>
                      <Button className="w-full rounded-xl font-semibold">Login / Register</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
