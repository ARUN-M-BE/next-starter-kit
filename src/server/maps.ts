import axios from "axios";

interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Geocodes an address into latitude and longitude coordinates.
 * Uses Nominatim OpenStreetMap service (free API).
 */
export async function geocode(address: string): Promise<GeocodeResult | null> {
  if (!address) return null;

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "NextjsStarterKitBoilerplate/1.0",
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}

/**
 * Reverse geocodes coordinates into a readable physical address string.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat,
        lon: lng,
        format: "json",
      },
      headers: {
        "User-Agent": "NextjsStarterKitBoilerplate/1.0",
      },
    });

    if (response.data) {
      return response.data.display_name || null;
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
}
