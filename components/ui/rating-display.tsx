import React from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RatingDisplayProps {
  ratings?: {
    apartment?: number;
    residentialComplex?: number;
    courtyard?: number;
    parking?: number;
    infrastructure?: number;
  };
  showLabels?: boolean;
  compact?: boolean;
}

export function RatingDisplay({
  ratings,
  showLabels = true,
  compact = false,
}: RatingDisplayProps) {
  if (!ratings) return null;

  const ratingLabels = {
    apartment: "Квартира",
    residentialComplex: "Жилой комплекс",
    courtyard: "Двор",
    parking: "Парковка",
    infrastructure: "Инфраструктура",
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${compact ? "h-3 w-3" : "h-4 w-4"} ${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const validRatings = Object.entries(ratings).filter(
    ([_, value]) => value !== undefined && value !== null
  );

  if (validRatings.length === 0) return null;

  return (
    <div className={`space-y-${compact ? "1" : "2"}`}>
      {validRatings.map(([key, rating]) => (
        <div key={key} className="flex items-center gap-2">
          {showLabels && (
            <span
              className={`text-sm text-gray-600 min-w-[100px] ${
                compact ? "text-xs" : ""
              }`}
            >
              {ratingLabels[key as keyof typeof ratingLabels]}:
            </span>
          )}
          <div className="flex items-center gap-1">
            {renderStars(rating!)}
            <span className={`text-sm font-medium ${compact ? "text-xs" : ""}`}>
              {rating}/5
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RatingBadge({ rating }: { rating?: number }) {
  if (!rating) return null;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800 border-green-200";
    if (rating >= 3.5) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating >= 2.5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <Badge variant="outline" className={getRatingColor(rating)}>
      <Star className="h-3 w-3 mr-1 fill-current" />
      {rating}/5
    </Badge>
  );
}
