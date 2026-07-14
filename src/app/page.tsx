import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  MailOpen,
  PhoneCall,
  Map,
  MoonStar,
  Users,
  Database,
  Terminal,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "OTP Verification",
      description: "Passwordless authentication using 6-digit verification codes sent via SMS.",
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Prisma & SQLite",
      description: "Full ORM mapping ready with pre-configured schemas for users and OTP models.",
    },
    {
      icon: <MailOpen className="h-6 w-6 text-primary" />,
      title: "Email Integration",
      description: "Send transactional receipts and alerts via SMTP or Resend API integrations.",
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-primary" />,
      title: "SMS Gateway",
      description: "Pre-integrated with Twilio with local console logger fallbacks for sandbox testing.",
    },
    {
      icon: <Map className="h-6 w-6 text-primary" />,
      title: "Map Integration",
      description: "Dynamic geocoding and visual tracking using Leaflet and OpenStreetMap.",
    },
    {
      icon: <MoonStar className="h-6 w-6 text-primary" />,
      title: "Dark / Light Themes",
      description: "Seamless color toggling using next-themes and pre-defined variables.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-24 sm:py-32">
          {/* Subtle gradient backgrounds */}
          <div className="absolute top-0 right-1/4 h-[400px] w-[400px] bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
          <div className="absolute bottom-12 left-1/4 h-[300px] w-[300px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Full-Stack Next.js 16 Starter Kit</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight animate-fade-in">
              Scaffold Your Next Project{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              A premium boilerplate complete with database, user auth, email notifications, maps, and component configurations.
            </p>

            <div className="flex justify-center items-center gap-4 pt-4">
              <Link href="/auth/login">
                <Button size="lg" className="rounded-xl px-8 h-12 text-sm font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 text-sm font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30 border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Batteries Included</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Everything you need pre-configured so you can focus on building your app.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="bg-card text-card-foreground border rounded-2xl p-6 text-left hover:shadow-lg hover:border-primary/30 transition-all group hover:-translate-y-1 duration-300"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-4xl sm:text-5xl font-extrabold text-primary">100%</p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Free-Tier Friendly</p>
              </div>
              <div className="space-y-2 border-y sm:border-y-0 sm:border-x py-6 sm:py-0">
                <p className="text-4xl sm:text-5xl font-extrabold text-primary">20+</p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reusable UI Assets</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl sm:text-5xl font-extrabold text-primary">&lt; 1 min</p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Installation to Launch</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
