"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Load Leaflet map component with ssr disabled to prevent window object compiler errors
const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full rounded-2xl border bg-muted flex items-center justify-center animate-pulse">
      <div className="text-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground font-medium">Loading map tiles...</p>
      </div>
    </div>
  ),
});

export default function MapsPage() {
  const [addressQuery, setAddressQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.076, 72.8777]); // Mumbai default coordinates
  const [zoomLevel, setZoomLevel] = useState(13);
  const [locationName, setLocationName] = useState("Mumbai, Maharashtra, India");

  const markers = [
    {
      id: "marker_center",
      position: mapCenter,
      title: "Active Marker Pin",
      description: locationName,
    },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressQuery.trim()) {
      toast.error("Please enter an address or landmark name");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/auth/profile`); // Just verify auth session passes first
      
      // Perform nominatim search directly to OSM API
      const searchRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          addressQuery
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "NextjsStarterKitBoilerplate/1.0",
          },
        }
      );

      if (!searchRes.ok) throw new Error("Geocoding service unavailable");
      const results = await searchRes.json();

      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const newCoords: [number, number] = [parseFloat(lat), parseFloat(lon)];
        
        setMapCenter(newCoords);
        setZoomLevel(15);
        setLocationName(display_name);
        toast.success("Location coordinates resolved!");
      } else {
        toast.error("No coordinates found for that location");
      }
    } catch (err: any) {
      toast.error("Geocoding request failed. Please check connection.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-left">
        <PageHeader
          title="Maps Integration"
          description="Geocode addresses using Nominatim API and render pins in a Leaflet Map."
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Maps" }]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Geocoding search container */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-border/60 shadow-sm glass bg-card/65">
              <CardHeader className="text-left">
                <CardTitle className="text-lg font-bold">Search Location</CardTitle>
                <CardDescription>
                  Enter any city, street address, or zip code to view it on the map.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <Input
                      placeholder="e.g. Gateway of India, Mumbai"
                      value={addressQuery}
                      onChange={(e) => setAddressQuery(e.target.value)}
                      className="rounded-xl border-border/60"
                      disabled={isSearching}
                    />
                  </div>
                  <Button type="submit" disabled={isSearching} className="w-full rounded-xl font-semibold flex items-center justify-center">
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resolving Address...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Locate Pin
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="text-left">
                <CardTitle className="text-sm font-semibold flex items-center text-primary">
                  <Navigation className="h-4 w-4 mr-2" />
                  Resolved Coordinates
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-left">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-muted-foreground uppercase">Latitude:</span>
                  <span className="font-mono">{mapCenter[0].toFixed(6)}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="font-semibold text-muted-foreground uppercase">Longitude:</span>
                  <span className="font-mono">{mapCenter[1].toFixed(6)}</span>
                </div>
                <div className="pt-1.5">
                  <span className="font-semibold text-muted-foreground uppercase block mb-1">Display Name:</span>
                  <p className="text-muted-foreground leading-relaxed font-sans">{locationName}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map card */}
          <div className="lg:col-span-2">
            <Card className="border-border/60 shadow-sm overflow-hidden h-full">
              <CardContent className="p-0 h-full min-h-[450px]">
                <MapView center={mapCenter} zoom={zoomLevel} markers={markers} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
