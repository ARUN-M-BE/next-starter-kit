"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield, Compass, Mail, Home, LayoutDashboard, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NAV_ITEMS } from "@/lib/constants";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  // Monitor scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              if (item.protected && !isSignedIn) return null;

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

            <Suspense fallback={null}>
              <Show when="signed-in">
                <UserButton />
              </Show>
              <Show when="signed-out">
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="rounded-xl">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="rounded-xl font-semibold shadow-sm hover:scale-[1.02] transition-transform">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </Show>
            </Suspense>
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
                      if (item.protected && !isSignedIn) return null;
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
                  <Suspense fallback={null}>
                    <Show when="signed-in">
                      <div className="flex items-center space-x-3">
                        <UserButton />
                        <div className="text-left">
                          <p className="text-sm font-semibold truncate max-w-[140px]">
                            {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Account"}
                          </p>
                          <p className="text-xs text-muted-foreground">Signed In</p>
                        </div>
                      </div>
                    </Show>
                    <Show when="signed-out">
                      <div className="flex flex-col space-y-2">
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            Sign In
                          </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button
                            className="w-full rounded-xl font-semibold"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            Sign Up
                          </Button>
                        </SignUpButton>
                      </div>
                    </Show>
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
