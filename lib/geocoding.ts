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
      // Use GeoNames API directly for city search
      const baseUrl = "http://api.geonames.org/searchJSON";
      const params = new URLSearchParams({
        name_startsWith: query,
        maxRows: limit.toString(),
        username: "oktamov_shohjahon",
        featureClass: "P", // populated places (city, village, etc)
      });

      const url = `${baseUrl}?${params}`;
      console.log("Calling GeoNames API:", url);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("GeoNames response:", data);

      if (Array.isArray(data.geonames)) {
        const suggestions = data.geonames.map((item: any) => ({
          place_id: item.geonameId,
          display_name: `${item.name}${
            item.adminName1 ? ", " + item.adminName1 : ""
          }${item.countryName ? ", " + item.countryName : ""}`,
          lat: item.lat,
          lon: item.lng,
          type: item.fcodeName,
          address: {
            city: item.name,
            state: item.adminName1,
            country: item.countryName,
          },
        }));

        const result: GeocodingResult = { suggestions };
        this.cache.set(cacheKey, result);

        console.log("Found", suggestions.length, "cities for:", query);
        return result;
      }

      return { suggestions: [] };
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
      // For street search, we'll use Nominatim API directly
      const baseUrl = "https://nominatim.openstreetmap.org/search";
      const params = new URLSearchParams({
        q: city ? `${query}, ${city}` : query,
        format: "json",
        addressdetails: "1",
        limit: limit.toString(),
        featuretype: "street",
      });

      const response = await fetch(`${baseUrl}?${params}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "ProKvartiru/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const suggestions = data.map((item: any) => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        type: item.type,
        address: item.address || {},
      }));

      const result: GeocodingResult = { suggestions };
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
      const baseUrl = "https://nominatim.openstreetmap.org/reverse";
      const params = new URLSearchParams({
        lat,
        lon,
        format: "json",
        addressdetails: "1",
      });

      const response = await fetch(`${baseUrl}?${params}`, {
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

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

export const geocodingService = new GeocodingService();
