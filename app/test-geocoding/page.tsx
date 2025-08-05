"use client";

import { useState } from "react";
import { geocodingService } from "@/lib/geocoding";

export default function TestGeocodingPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await geocodingService.searchCities(query, 10);
      console.log("Test result:", result);
      setResults(result.suggestions || []);
    } catch (error) {
      console.error("Test error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Geocoding API Test</h1>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city name..."
            className="border p-2 rounded w-full max-w-md"
          />
        </div>

        <button
          onClick={testSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search Cities"}
        </button>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">
            Results ({results.length})
          </h2>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="border p-3 rounded">
                <div className="font-medium">{result.display_name}</div>
                <div className="text-sm text-gray-600">
                  Type: {result.type} | Lat: {result.lat} | Lon: {result.lon}
                </div>
                {result.address && (
                  <div className="text-xs text-gray-500 mt-1">
                    Address: {JSON.stringify(result.address)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
