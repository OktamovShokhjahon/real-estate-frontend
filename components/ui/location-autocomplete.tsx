"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface LocationOption {
  value: string;
  label: string;
  description?: string;
  country?: string;
  state?: string;
}

interface LocationAutocompleteProps {
  options: LocationOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function LocationAutocomplete({
  options,
  value,
  onValueChange,
  onSearchChange,
  placeholder = "Выберите...",
  searchPlaceholder = "Поиск...",
  emptyMessage = "Ничего не найдено.",
  loading = false,
  disabled = false,
  className,
}: LocationAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  // Clear search value when popover opens
  React.useEffect(() => {
    if (open) {
      setSearchValue("");
    }
  }, [open]);

  const handleSearchChange = (query: string) => {
    console.log("LocationAutocomplete: Search changed to:", query);
    setSearchValue(query);
    onSearchChange?.(query);
  };

  const handleSelect = (selectedValue: string) => {
    const option = options.find((opt) => opt.value === selectedValue);
    if (option) {
      onValueChange(option.value);
      setSearchValue(option.label);
    }
    setOpen(false);
  };

  console.log("LocationAutocomplete render:", {
    options: options.length,
    value,
    searchValue,
    open,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.country && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {selectedOption.country}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
              autoFocus
            />
          </div>
        </div>
        <Command>
          <CommandList>
            <CommandEmpty>
              {loading ? "Загрузка..." : emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-sm text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
