"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  LocationAutocomplete,
  LocationOption,
} from "@/components/ui/location-autocomplete";
import { geocodingService, LocationSuggestion } from "@/lib/geocoding";
import { addressApi } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star } from "lucide-react";

interface EnhancedLocationSearchProps {
  type: "city" | "street";
  value?: string;
  onValueChange: (value: string) => void;
  cityValue?: string; // For street search, we need the selected city
  placeholder?: string;
  label?: string;
  className?: string;
  showRemembered?: boolean; // Whether to show remembered addresses
}

interface RememberedAddress {
  _id: string;
  city: string;
  street: string;
  building: string;
  residentialComplex?: string;
  usageCount: number;
}

export function EnhancedLocationSearch({
  type,
  value,
  onValueChange,
  cityValue,
  placeholder,
  label,
  className,
  showRemembered = true,
}: EnhancedLocationSearchProps) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rememberedAddresses, setRememberedAddresses] = useState<
    RememberedAddress[]
  >([]);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load remembered addresses when component mounts or city changes
  useEffect(() => {
    if (showRemembered) {
      loadRememberedAddresses();
    }
  }, [cityValue, showRemembered]);

  const loadRememberedAddresses = useCallback(async () => {
    try {
      let addresses: RememberedAddress[] = [];

      if (type === "city") {
        // For city search, get popular addresses
        const response = await addressApi.getPopularAddresses(10);
        addresses = response.addresses || [];
      } else if (cityValue) {
        // For street search, get remembered addresses for the selected city
        const response = await addressApi.getRememberedAddresses(cityValue, 10);
        addresses = response.addresses || [];
      }

      setRememberedAddresses(addresses);
    } catch (error) {
      console.error("Error loading remembered addresses:", error);
    }
  }, [type, cityValue, showRemembered]);

  const searchLocations = useCallback(
    async (query: string) => {
      console.log(
        "EnhancedLocationSearch: Searching for:",
        query,
        "type:",
        type
      );

      if (!query.trim() || query.length < 2) {
        console.log(
          "EnhancedLocationSearch: Query too short, showing remembered addresses"
        );
        if (showRemembered) {
          await loadRememberedAddresses();
        }
        return;
      }

      setLoading(true);
      try {
        let result;
        let rememberedResults: RememberedAddress[] = [];

        // Get geocoding results
        if (type === "city") {
          console.log("EnhancedLocationSearch: Calling searchCities");
          result = await geocodingService.searchCities(query, 10);

          // Also search remembered addresses
          if (showRemembered) {
            try {
              const rememberedResponse = await addressApi.searchAddresses(
                query,
                5
              );
              rememberedResults = rememberedResponse.addresses || [];
            } catch (error) {
              console.error("Error searching remembered addresses:", error);
            }
          }
        } else {
          console.log("EnhancedLocationSearch: Calling searchStreets");
          result = await geocodingService.searchStreets(query, cityValue, 10);

          // Also search remembered addresses for the city
          if (showRemembered && cityValue) {
            try {
              const rememberedResponse =
                await addressApi.getRememberedAddresses(cityValue, 5);
              rememberedResults = rememberedResponse.addresses || [];
            } catch (error) {
              console.error("Error searching remembered addresses:", error);
            }
          }
        }

        console.log("EnhancedLocationSearch: Got result:", result);

        if (result.error) {
          console.error("Geocoding error:", result.error);
          setOptions([]);
          return;
        }

        // Convert geocoding results to options
        const geocodingOptions: LocationOption[] = result.suggestions.map(
          (suggestion: LocationSuggestion) => {
            const address = suggestion.address;
            let label = suggestion.display_name;
            let description = "";
            let country = address.country;

            if (type === "city") {
              const cityName = address.city || address.town || address.village;
              if (cityName) {
                label = cityName;
                const parts = [];
                if (address.state) parts.push(address.state);
                if (address.country) parts.push(address.country);
                description = parts.join(", ");
              }
            } else {
              const streetName = address.street || address.road;
              if (streetName) {
                label = streetName;
                const parts = [];
                if (address.city || address.town)
                  parts.push(address.city || address.town);
                if (address.state) parts.push(address.state);
                if (address.country) parts.push(address.country);
                description = parts.join(", ");
              }
            }

            return {
              value: label,
              label,
              description,
              country,
              source: "geocoding" as const,
            };
          }
        );

        // Convert remembered addresses to options
        const rememberedOptions: LocationOption[] = rememberedResults.map(
          (address: RememberedAddress) => {
            let label = "";
            let description = "";

            if (type === "city") {
              label = address.city;
              description = `${address.street}, ${address.building}`;
              if (address.residentialComplex) {
                description += ` (${address.residentialComplex})`;
              }
            } else {
              label = address.street;
              description = `${address.building}`;
              if (address.residentialComplex) {
                description += ` (${address.residentialComplex})`;
              }
            }

            return {
              value: label,
              label,
              description,
              source: "remembered" as const,
              usageCount: address.usageCount,
            };
          }
        );

        // Combine and deduplicate options
        const allOptions = [...geocodingOptions, ...rememberedOptions];
        const uniqueOptions = allOptions.filter(
          (option, index, self) =>
            index === self.findIndex((o) => o.value === option.value)
        );

        // Sort remembered addresses first, then by usage count
        uniqueOptions.sort((a, b) => {
          if (a.source === "remembered" && b.source !== "remembered") return -1;
          if (a.source !== "remembered" && b.source === "remembered") return 1;
          if (a.usageCount && b.usageCount) {
            return b.usageCount - a.usageCount;
          }
          return 0;
        });

        setOptions(uniqueOptions);
      } catch (error) {
        console.error("Error searching locations:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [type, cityValue, showRemembered, loadRememberedAddresses]
  );

  useEffect(() => {
    searchLocations(debouncedQuery);
  }, [debouncedQuery, searchLocations]);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setSearchQuery(selectedValue);
  };

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    if (!inputValue.trim()) {
      setOptions([]);
      if (showRemembered) {
        loadRememberedAddresses();
      }
    }
  };

  // Create options for remembered addresses when no search query
  const rememberedOptions: LocationOption[] = rememberedAddresses.map(
    (address: RememberedAddress) => {
      let label = "";
      let description = "";

      if (type === "city") {
        label = address.city;
        description = `${address.street}, ${address.building}`;
        if (address.residentialComplex) {
          description += ` (${address.residentialComplex})`;
        }
      } else {
        label = address.street;
        description = `${address.building}`;
        if (address.residentialComplex) {
          description += ` (${address.residentialComplex})`;
        }
      }

      return {
        value: label,
        label,
        description,
        source: "remembered" as const,
        usageCount: address.usageCount,
      };
    }
  );

  const allOptions = searchQuery.trim() ? options : rememberedOptions;

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <LocationAutocomplete
        value={value || ""}
        onValueChange={handleSelect}
        onInputChange={handleInputChange}
        options={allOptions}
        loading={loading}
        placeholder={
          placeholder ||
          (type === "city" ? "Поиск города..." : "Поиск улицы...")
        }
        renderOption={(option) => (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              {option.source === "remembered" ? (
                <Clock className="h-4 w-4 text-blue-500" />
              ) : (
                <MapPin className="h-4 w-4 text-gray-500" />
              )}
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500">
                    {option.description}
                  </div>
                )}
              </div>
            </div>
            {option.source === "remembered" && option.usageCount && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-500">
                  {option.usageCount}
                </span>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
