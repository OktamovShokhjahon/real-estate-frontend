export interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    street?: string;
    road?: string;
    country?: string;
    state?: string;
    postcode?: string;
  };
}

export interface GeocodingResult {
  suggestions: LocationSuggestion[];
  error?: string;
}

class GeocodingService {
  private baseUrl = "/api/geocoding";
  private cache = new Map<string, GeocodingResult>();

  async searchCities(
    query: string,
    limit: number = 10
  ): Promise<GeocodingResult> {
    const cacheKey = `city:${query}:${limit}`;

    console.log("Searching cities for:", query);

    if (this.cache.has(cacheKey)) {
      console.log("Using cached result for:", query);
      return this.cache.get(cacheKey)!;
    }

    try {
      const params = new URLSearchParams({
        q: query,
        type: "city",
        limit: limit.toString(),
      });

      const url = `${this.baseUrl}?${params}`;
      console.log("Calling geocoding API:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Geocoding API response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      const result: GeocodingResult = { suggestions: data.suggestions };
      this.cache.set(cacheKey, result);

      console.log("Found", data.suggestions.length, "cities for:", query);
      return result;
    } catch (error) {
      console.error("Error searching cities:", error);
      return {
        suggestions: [],
        error: "Failed to search cities",
      };
    }
  }

  async searchStreets(
    query: string,
    city?: string,
    limit: number = 10
  ): Promise<GeocodingResult> {
    const cacheKey = `street:${query}:${city}:${limit}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const params = new URLSearchParams({
        q: query,
        type: "street",
        limit: limit.toString(),
      });

      if (city) {
        params.append("city", city);
      }

      const response = await fetch(`${this.baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const result: GeocodingResult = { suggestions: data.suggestions };
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Error searching streets:", error);
      return {
        suggestions: [],
        error: "Failed to search streets",
      };
    }
  }

  async reverseGeocode(
    lat: string,
    lon: string
  ): Promise<LocationSuggestion | null> {
    try {
      const params = new URLSearchParams({
        lat,
        lon,
        format: "json",
        addressdetails: "1",
      });

      const response = await fetch(`${this.baseUrl}/reverse?${params}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "ProKvartiru/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        place_id: data.place_id,
        display_name: data.display_name,
        lat: data.lat,
        lon: data.lon,
        type: data.type,
        address: data.address || {},
      };
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return null;
    }
  }

  // Clear cache (useful for testing or memory management)
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size for debugging
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const geocodingService = new GeocodingService();
