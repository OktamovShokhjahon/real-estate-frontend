"use client";

import { useQuery } from "react-query";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Building, Users } from "lucide-react";

export function CityStats() {
  const { data: cityData, isLoading } = useQuery("city-stats", async () => {
    const response = await api.get("/admin/city-stats");
    return response.data;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cityStats = cityData?.cities || [];
  const topCities = cityStats.slice(0, 10);

  const totalReviews = cityStats.reduce(
    (sum: number, city: any) => sum + city.totalReviews,
    0
  );
  const totalCities = cityStats.length;
  const avgReviewsPerCity =
    totalCities > 0 ? Math.round(totalReviews / totalCities) : 0;

  if (cityStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Статистика по городам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Нет данных по городам</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Географический обзор */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего городов</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCities}</div>
            <p className="text-xs text-muted-foreground">С отзывами</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего отзывов</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalReviews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Во всех городах</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Среднее на город
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgReviewsPerCity}</div>
            <p className="text-xs text-muted-foreground">Отзывов на город</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Топ город</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topCities[0]?.totalReviews || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {topCities[0]?.city || "Н/Д"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Топ города по количеству отзывов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Топ городов по количеству отзывов
            </CardTitle>
            <CardDescription>
              Города с наибольшим количеством отзывов о недвижимости и жильцах
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities.map((city: any, index: number) => (
                <div
                  key={city.city}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{city.city}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{city.propertyReviews} недвижимости</span>
                        <span>•</span>
                        <span>{city.tenantReviews} жильцов</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{city.totalReviews}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">
                        ★ {city.averageRating}
                      </span>
                      {city.growth > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700"
                        >
                          +{city.growth}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Тренды роста по городам
            </CardTitle>
            <CardDescription>
              Города с самым быстрым ростом активности по отзывам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities
                .filter((city: any) => city.growth > 0)
                .sort((a: any, b: any) => b.growth - a.growth)
                .slice(0, 8)
                .map((city: any, index: number) => (
                  <div
                    key={city.city}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{city.city}</p>
                        <p className="text-sm text-gray-600">
                          {city.totalReviews} всего отзывов
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700">
                        +{city.growth}%
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        ★ {city.averageRating}
                      </p>
                    </div>
                  </div>
                ))}
              {topCities.filter((city: any) => city.growth > 0).length ===
                0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Нет данных о росте</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Распределение отзывов по городам */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Распределение отзывов
          </CardTitle>
          <CardDescription>
            Отзывы о недвижимости и жильцах по топ городам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCities.slice(0, 8).map((city: any) => {
              const propertyPercentage =
                city.totalReviews > 0
                  ? Math.round((city.propertyReviews / city.totalReviews) * 100)
                  : 0;
              const tenantPercentage = 100 - propertyPercentage;

              return (
                <div key={city.city} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{city.city}</span>
                    <span className="text-sm text-gray-600">
                      {city.totalReviews} отзывов
                    </span>
                  </div>
                  <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 transition-all duration-300"
                      style={{ width: `${propertyPercentage}%` }}
                      title={`${city.propertyReviews} отзывов о недвижимости (${propertyPercentage}%)`}
                    />
                    <div
                      className="bg-purple-500 transition-all duration-300"
                      style={{ width: `${tenantPercentage}%` }}
                      title={`${city.tenantReviews} отзывов о жильцах (${tenantPercentage}%)`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      Недвижимость: {city.propertyReviews} ({propertyPercentage}
                      %)
                    </span>
                    <span>
                      Жильцы: {city.tenantReviews} ({tenantPercentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
