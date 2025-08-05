"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  LocationAutocomplete,
  LocationOption,
} from "@/components/ui/location-autocomplete";
import { geocodingService, LocationSuggestion } from "@/lib/geocoding";
import { Label } from "@/components/ui/label";

interface LocationSearchProps {
  type: "city" | "street";
  value?: string;
  onValueChange: (value: string) => void;
  cityValue?: string; // For street search, we need the selected city
  placeholder?: string;
  label?: string;
  className?: string;
}

export function LocationSearch({
  type,
  value,
  onValueChange,
  cityValue,
  placeholder,
  label,
  className,
}: LocationSearchProps) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 300);

  const searchLocations = useCallback(
    async (query: string) => {
      console.log("LocationSearch: Searching for:", query, "type:", type);

      if (!query.trim() || query.length < 2) {
        console.log("LocationSearch: Query too short, clearing options");
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        let result;

        if (type === "city") {
          console.log("LocationSearch: Calling searchCities");
          result = await geocodingService.searchCities(query, 15);
        } else {
          console.log("LocationSearch: Calling searchStreets");
          result = await geocodingService.searchStreets(query, cityValue, 15);
        }

        console.log("LocationSearch: Got result:", result);

        if (result.error) {
          console.error("Geocoding error:", result.error);
          setOptions([]);
          return;
        }

        const autocompleteOptions: LocationOption[] = result.suggestions.map(
          (suggestion: LocationSuggestion) => {
            const address = suggestion.address;
            let label = suggestion.display_name;
            let description = "";
            let country = address.country;

            if (type === "city") {
              // For cities, show a cleaner format
              const cityName = address.city || address.town || address.village;
              if (cityName) {
                label = cityName;
                const parts = [];
                if (address.state) parts.push(address.state);
                if (address.country) parts.push(address.country);
                description = parts.join(", ");
              }
            } else {
              // For streets, show street name and city
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
            };
          }
        );

        // Remove duplicates based on value
        const uniqueOptions = autocompleteOptions.filter(
          (option, index, self) =>
            index === self.findIndex((o) => o.value === option.value)
        );

        setOptions(uniqueOptions);
      } catch (error) {
        console.error("Error searching locations:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [type, cityValue]
  );

  useEffect(() => {
    console.log("LocationSearch: Debounced query changed to:", debouncedQuery);
    searchLocations(debouncedQuery);
  }, [debouncedQuery, searchLocations]);

  useEffect(() => {
    if (value && !searchQuery) {
      setSearchQuery(value);
    }
  }, [value, searchQuery]);

  // Debug effect to see when searchQuery changes
  useEffect(() => {
    console.log("LocationSearch: searchQuery changed to:", searchQuery);
  }, [searchQuery]);

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    setSearchQuery(newValue);
  };

  const getDefaultPlaceholder = () => {
    if (type === "city") {
      return "Введите название города...";
    } else {
      return cityValue
        ? `Введите название улицы в ${cityValue}...`
        : "Сначала выберите город...";
    }
  };

  const getDefaultLabel = () => {
    return type === "city" ? "Город" : "Улица";
  };

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <LocationAutocomplete
        options={options}
        value={value}
        onValueChange={handleValueChange}
        onSearchChange={setSearchQuery}
        placeholder={placeholder || getDefaultPlaceholder()}
        searchPlaceholder={`Поиск ${type === "city" ? "городов" : "улиц"}...`}
        emptyMessage={`${type === "city" ? "Города" : "Улицы"} не найдены`}
        loading={loading}
        disabled={type === "street" && !cityValue}
      />
    </div>
  );
}
