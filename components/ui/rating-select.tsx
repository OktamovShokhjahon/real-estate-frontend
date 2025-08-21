import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface RatingSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function RatingSelect({
  value,
  onValueChange,
  label,
  placeholder = "Выберите рейтинг",
  required = false,
}: RatingSelectProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>
        {label} {required && "*"}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map((rating) => (
            <SelectItem key={rating} value={rating.toString()}>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(rating)}</div>
                <span>
                  {rating}{" "}
                  {rating === 1 ? "звезда" : rating < 5 ? "звезды" : "звезд"}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
