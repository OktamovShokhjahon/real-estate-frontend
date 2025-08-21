"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MapPin,
  Building,
  Home,
  User,
  Users,
  Star,
  Calendar,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  _id: string;
  title?: string;
  content?: string;
  reviewText?: string;
  rating: number;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  reviewType?: string;
  city: string;
  street: string;
  building: string;
  residentialComplex?: string;
  comments?: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  }>;
}

interface SearchResponse {
  propertyReviews: SearchResult[];
  residentialComplexReviews: SearchResult[];
  landlordReviews: SearchResult[];
  tenantReviews: SearchResult[];
  propertyTotal: number;
  residentialComplexTotal: number;
  landlordTotal: number;
  tenantTotal: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [street, setStreet] = useState(searchParams.get("street") || "");
  const [building, setBuilding] = useState(searchParams.get("building") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [idLastFour, setIdLastFour] = useState("");
  const [phoneLastFour, setPhoneLastFour] = useState("");

  const debouncedCity = useDebounce(city, 400);
  const debouncedStreet = useDebounce(street, 400);
  const debouncedBuilding = useDebounce(building, 400);
  const debouncedIdLastFour = useDebounce(idLastFour, 400);
  const debouncedPhoneLastFour = useDebounce(phoneLastFour, 400);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedCity) params.set("city", debouncedCity);
    if (debouncedStreet) params.set("street", debouncedStreet);
    if (debouncedBuilding) params.set("building", debouncedBuilding);
    if (debouncedIdLastFour) params.set("idLastFour", debouncedIdLastFour);
    if (debouncedPhoneLastFour)
      params.set("phoneLastFour", debouncedPhoneLastFour);

    const newUrl = params.toString()
      ? `/search?${params.toString()}`
      : "/search";
    router.replace(newUrl, { scroll: false });
  }, [
    debouncedCity,
    debouncedStreet,
    debouncedBuilding,
    debouncedIdLastFour,
    debouncedPhoneLastFour,
    router,
  ]);

  // Perform search when component mounts with URL parameters
  useEffect(() => {
    if (
      debouncedCity ||
      debouncedStreet ||
      debouncedBuilding ||
      debouncedIdLastFour ||
      debouncedPhoneLastFour
    ) {
      performSearch(true);
    }
  }, [
    debouncedCity,
    debouncedStreet,
    debouncedBuilding,
    debouncedIdLastFour,
    debouncedPhoneLastFour,
  ]);

  const performSearch = async (isAuto: boolean = false) => {
    if (
      !debouncedCity &&
      !debouncedStreet &&
      !debouncedBuilding &&
      !debouncedIdLastFour &&
      !debouncedPhoneLastFour
    ) {
      setError("Пожалуйста, введите хотя бы город для поиска");
      return;
    }

    if (!isAuto) setIsSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (debouncedCity) params.append("city", debouncedCity);
      if (debouncedStreet) params.append("street", debouncedStreet);
      if (debouncedBuilding) params.append("building", debouncedBuilding);
      if (debouncedIdLastFour) params.append("idLastFour", debouncedIdLastFour);
      if (debouncedPhoneLastFour)
        params.append("phoneLastFour", debouncedPhoneLastFour);
      params.append("limit", "20");

      const response = await api.get(`/property/mixed-reviews?${params}`);
      setSearchResults(response.data);
    } catch (err: any) {
      console.error("Search error:", err);
      if (err.response?.status === 404) {
        setError(
          "По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска."
        );
      } else if (err.response?.status === 500) {
        setError("Ошибка сервера. Попробуйте позже.");
      } else {
        setError(
          "Произошла ошибка при поиске. Проверьте подключение к интернету."
        );
      }
    } finally {
      if (!isAuto) setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReviewTypeLabel = (reviewType?: string) => {
    switch (reviewType) {
      case "residentialComplex":
        return "Жилой комплекс";
      case "landlord":
        return "Арендодатель";
      case "tenant":
        return "Арендатор";
      default:
        return "Квартира";
    }
  };

  const getReviewTypeIcon = (reviewType?: string) => {
    switch (reviewType) {
      case "residentialComplex":
        return <Building className="w-4 h-4" />;
      case "landlord":
        return <User className="w-4 h-4" />;
      case "tenant":
        return <Users className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  const ReviewCard = ({
    review,
    type,
  }: {
    review: SearchResult;
    type: string;
  }) => {
    console.log(review);

    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getReviewTypeIcon(review.reviewType)}
                <Badge variant="secondary" className="text-xs">
                  {getReviewTypeLabel(review.reviewType)}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">
                {review.title || review.reviewText || "Без названия"}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? "text-yellow-500 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm font-medium ml-1">
                {review.rating}/5
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>
              {[review.city, review.street, review.building]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {review.content || review.reviewText}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{review.comments?.length || 0}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Автор: {review.author.firstName} {review.author.lastName}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Поиск отзывов</h1>
        <p className="text-muted-foreground">
          Найдите отзывы о квартирах, жилых комплексах, арендодателях и
          арендаторах по адресу
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Поиск по адресу
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Город</label>
                <Input
                  placeholder="Например: Алматы"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isSearching}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Улица</label>
                <Input
                  placeholder="Например: ул. Абая"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  disabled={isSearching}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Дом</label>
                <Input
                  placeholder="Например: 15"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  disabled={isSearching}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Последние 4 цифры паспорта
                </label>
                <Input
                  placeholder="Например: 1234"
                  value={idLastFour}
                  onChange={(e) =>
                    setIdLastFour(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
                    )
                  }
                  disabled={isSearching}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Последние 4 цифры телефона
                </label>
                <Input
                  placeholder="Например: 5678"
                  value={phoneLastFour}
                  onChange={(e) =>
                    setPhoneLastFour(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
                    )
                  }
                  disabled={isSearching}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSearching}
                className="w-full md:w-auto"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Поиск...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Найти отзывы
                  </>
                )}
              </Button>
              {(city || street || building) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCity("");
                    setStreet("");
                    setBuilding("");
                    setSearchResults(null);
                    setError(null);
                  }}
                  className="w-full md:w-auto"
                >
                  Очистить
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-8 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!searchResults && !error && !isSearching && (
        <Card className="text-center py-16">
          <CardContent>
            <Search className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-4">
              Начните поиск отзывов
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Введите город, улицу или номер дома, чтобы найти отзывы о
              недвижимости, жилых комплексах, арендодателях и арендаторах.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSearching && (
        <Card className="text-center py-16">
          <CardContent>
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-primary" />
            <h3 className="text-xl font-semibold mb-4">Поиск отзывов...</h3>
            <p className="text-muted-foreground">
              Ищем отзывы по вашему запросу
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults && !isSearching && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Результаты поиска</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Поиск по: {[city, street, building].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Найдено:{" "}
              {searchResults.propertyTotal +
                searchResults.residentialComplexTotal +
                searchResults.landlordTotal +
                searchResults.tenantTotal}{" "}
              отзывов
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Все (
                {searchResults.propertyTotal +
                  searchResults.residentialComplexTotal +
                  searchResults.landlordTotal +
                  searchResults.tenantTotal}
                )
              </TabsTrigger>
              <TabsTrigger value="property">
                Квартиры ({searchResults.propertyTotal})
              </TabsTrigger>
              <TabsTrigger value="residentialComplex">
                ЖК ({searchResults.residentialComplexTotal})
              </TabsTrigger>
              <TabsTrigger value="landlord">
                Арендодатели ({searchResults.landlordTotal})
              </TabsTrigger>
              <TabsTrigger value="tenant">
                Арендаторы ({searchResults.tenantTotal})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Property Reviews */}
                {searchResults.propertyReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    type="property"
                  />
                ))}
                {/* Residential Complex Reviews */}
                {searchResults.residentialComplexReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    type="residentialComplex"
                  />
                ))}
                {/* Landlord Reviews */}
                {searchResults.landlordReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    type="landlord"
                  />
                ))}
                {/* Tenant Reviews */}
                {searchResults.tenantReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} type="tenant" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="property" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {searchResults.propertyReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    type="property"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="residentialComplex" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {searchResults.residentialComplexReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    type="residentialComplex"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="landlord" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {searchResults.landlordReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    type="landlord"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tenant" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {searchResults.tenantReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} type="tenant" />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* No Results Message */}
          {searchResults &&
            searchResults.propertyTotal === 0 &&
            searchResults.residentialComplexTotal === 0 &&
            searchResults.landlordTotal === 0 &&
            searchResults.tenantTotal === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Отзывы не найдены
                  </h3>
                  <p className="text-muted-foreground">
                    По вашему запросу не найдено ни одного отзыва. Попробуйте:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Изменить название города</li>
                    <li>• Убрать или изменить название улицы</li>
                    <li>• Убрать номер дома</li>
                    <li>• Использовать более общие термины</li>
                  </ul>
                </CardContent>
              </Card>
            )}
        </div>
      )}
    </div>
  );
}
//   );
// }

//   );
// }
//   );
// }
