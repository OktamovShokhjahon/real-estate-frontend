"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAuth } from "@/contexts/auth-context";
import { api, addressApi, recommendationApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingTopics } from "@/components/trending-topics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Star,
  Clock,
  TrendingUp,
  Heart,
  Building,
  Users,
  Calendar,
  ArrowRight,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PropertyReview {
  _id: string;
  city: string;
  street: string;
  building: string;
  numberOfRooms: number;
  rentalPeriod: {
    from: { month: number; year: number };
    to: { month: number; year: number };
  };
  landlordName: string;
  reviewText: string;
  rating?: number;
  author: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  comments?: any[];
}

interface PopularAddress {
  _id: string;
  city: string;
  street: string;
  building: string;
  residentialComplex?: string;
  usageCount: number;
}

interface RecommendationStats {
  totalReviews: number;
  totalAddresses: number;
  averageRating: number;
  mostPopularCity: string;
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<RecommendationStats | null>(null);

  // Fetch recent reviews
  const { data: recentReviews, isLoading: loadingReviews } = useQuery(
    ["recent-reviews"],
    async () => {
      const response = await api.get("/property/reviews?limit=8");
      return response.data;
    }
  );

  // Fetch popular addresses
  const { data: popularAddresses, isLoading: loadingAddresses } = useQuery(
    ["popular-addresses"],
    async () => {
      const response = await addressApi.getPopularAddresses(8);
      return response.data;
    }
  );

  // Fetch high-rated reviews
  const { data: highRatedReviews, isLoading: loadingHighRated } = useQuery(
    ["high-rated-reviews"],
    async () => {
      const response = await api.get("/property/reviews?limit=6");
      // Filter for reviews with rating >= 4
      const reviews = response.data.reviews || [];
      return reviews.filter(
        (review: PropertyReview) =>
          typeof review.rating === "number" && review.rating >= 4
      );
    }
  );

  // Fetch user's city preferences (if logged in)
  const { data: userPreferences } = useQuery(
    ["user-preferences", user?.email],
    recommendationApi.getUserPreferences,
    { enabled: !!user }
  );

  // Fetch stats from backend
  const { data: statsData, isLoading: loadingStats } = useQuery(
    ["recommendation-stats"],
    recommendationApi.getStats
  );

  // Use backend stats if available, otherwise calculate from other data
  useEffect(() => {
    if (statsData) {
      setStats(statsData);
    } else if (recentReviews && popularAddresses) {
      const reviews = recentReviews.reviews || [];
      const addresses = popularAddresses.addresses || [];

      const totalRating = reviews.reduce(
        (sum: number, review: PropertyReview) => sum + (review.rating || 0),
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;

      // Get most popular city
      const cityCounts: { [key: string]: number } = {};
      addresses.forEach((address: PopularAddress) => {
        cityCounts[address.city] =
          (cityCounts[address.city] || 0) + address.usageCount;
      });

      const mostPopularCity =
        Object.keys(cityCounts).reduce((a, b) =>
          cityCounts[a] > cityCounts[b] ? a : b
        ) || "Неизвестно";

      setStats({
        totalReviews: reviews.length,
        totalAddresses: addresses.length,
        averageRating: Math.round(averageRating * 10) / 10,
        mostPopularCity,
      });
    }
  }, [statsData, recentReviews, popularAddresses]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (loadingReviews || loadingAddresses || loadingHighRated || loadingStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Рекомендации для вас</h1>
          <p className="text-gray-600">
            Персонализированные рекомендации на основе ваших предпочтений и
            популярного контента
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка рекомендаций...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">
            Рекомендации для вас
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Персонализированные рекомендации на основе ваших предпочтений и
            популярного контента
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Всего отзывов
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      {stats.totalReviews}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Популярных адресов
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      {stats.totalAddresses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Средний рейтинг
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      {stats.averageRating}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Популярный город
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      {stats.mostPopularCity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="recommended" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="recommended"
              className="flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>Рекомендуемое</span>
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Популярное</span>
            </TabsTrigger>
            <TabsTrigger
              value="high-rated"
              className="flex items-center space-x-2"
            >
              <Star className="h-4 w-4" />
              <span>Высокий рейтинг</span>
            </TabsTrigger>
          </TabsList>

          {/* Recommended Tab */}
          <TabsContent value="recommended" className="space-y-6">
            {/* Trending Topics */}
            <TrendingTopics />

            {/* User Preferences Section */}
            {userPreferences && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Основано на ваших предпочтениях
                  </CardTitle>
                  <CardDescription>
                    Рекомендации на основе вашего города:{" "}
                    {userPreferences.preferredCity}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {popularAddresses?.addresses
                      ?.filter(
                        (address: PopularAddress) =>
                          address.city === userPreferences.preferredCity
                      )
                      .slice(0, 4)
                      .map((address: PopularAddress) => (
                        <Link
                          key={address._id}
                          href={`/property?city=${encodeURIComponent(
                            address.city
                          )}&street=${encodeURIComponent(
                            address.street
                          )}&building=${encodeURIComponent(address.building)}`}
                          className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-red-100 rounded-full">
                                <Heart className="h-4 w-4 text-red-500" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {address.street} {address.building}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {address.city}
                                  {address.residentialComplex && (
                                    <span className="ml-1">
                                      • {address.residentialComplex}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">
                                {address.usageCount} отзывов
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      Недавние отзывы
                    </CardTitle>
                    <CardDescription>
                      Последние отзывы, которые могут вас заинтересовать
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/property">Смотреть все</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recentReviews?.reviews?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>Пока нет отзывов</p>
                    </div>
                  ) : (
                    recentReviews?.reviews
                      ?.slice(0, 4)
                      .map((review: PropertyReview) => (
                        <Link
                          key={review._id}
                          href={`/property/${review._id}`}
                          className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {review.street} {review.building},{" "}
                                  {review.city}
                                </span>
                                {typeof review.rating === "number" && (
                                  <div className="flex items-center space-x-1">
                                    <Star
                                      className={`h-4 w-4 ${getRatingColor(
                                        review.rating
                                      )}`}
                                    />
                                    <span
                                      className={`text-sm ${getRatingColor(
                                        review.rating
                                      )}`}
                                    >
                                      {review.rating}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {review.reviewText}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{review.numberOfRooms} комнат</span>
                                <span>{formatDate(review.createdAt)}</span>
                                <span>
                                  {review.author.firstName}{" "}
                                  {review.author.lastName}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
                          </div>
                        </Link>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Popular Tab */}
          <TabsContent value="popular" className="space-y-6">
            {/* Most Popular Addresses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      Самые популярные адреса
                    </CardTitle>
                    <CardDescription>
                      Адреса с наибольшим количеством отзывов
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/property">Смотреть все</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {popularAddresses?.addresses?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>Пока нет популярных адресов</p>
                    </div>
                  ) : (
                    popularAddresses?.addresses
                      ?.slice(0, 6)
                      .map((address: PopularAddress, index: number) => (
                        <Link
                          key={address._id}
                          href={`/property?city=${encodeURIComponent(
                            address.city
                          )}&street=${encodeURIComponent(
                            address.street
                          )}&building=${encodeURIComponent(address.building)}`}
                          className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-full">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  #{index + 1} {address.street}{" "}
                                  {address.building}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {address.city}
                                  {address.residentialComplex && (
                                    <span className="ml-1">
                                      • {address.residentialComplex}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">
                                {address.usageCount} отзывов
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </Link>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Most Active Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-500" />
                  Самые активные города
                </CardTitle>
                <CardDescription>
                  Города с наибольшей активностью пользователей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {popularAddresses?.addresses &&
                    Object.entries(
                      popularAddresses.addresses.reduce(
                        (
                          cities: { [key: string]: number },
                          address: PopularAddress
                        ) => {
                          cities[address.city] =
                            (cities[address.city] || 0) + address.usageCount;
                          return cities;
                        },
                        {}
                      )
                    )
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 5)
                      .map(([city, count], index) => (
                        <div
                          key={city}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-full">
                              <span className="text-purple-600 font-bold">
                                #{index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{city}</div>
                              <div className="text-sm text-gray-500">
                                {count} отзывов
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/property?city=${encodeURIComponent(
                                city
                              )}`}
                            >
                              Смотреть
                            </Link>
                          </Button>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* High Rated Tab */}
          <TabsContent value="high-rated" className="space-y-6">
            {/* High Rated Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      Отзывы с высоким рейтингом
                    </CardTitle>
                    <CardDescription>
                      Лучшие отзывы с рейтингом 4+ звезд
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/property">Смотреть все</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {highRatedReviews?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Star className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>Пока нет отзывов с высоким рейтингом</p>
                    </div>
                  ) : (
                    highRatedReviews
                      ?.slice(0, 6)
                      .map((review: PropertyReview) => (
                        <Link
                          key={review._id}
                          href={`/property/${review._id}`}
                          className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {review.street} {review.building},{" "}
                                  {review.city}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-yellow-600 font-medium">
                                    {review.rating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {review.reviewText}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{review.numberOfRooms} комнат</span>
                                <span>{formatDate(review.createdAt)}</span>
                                <span>
                                  {review.author.firstName}{" "}
                                  {review.author.lastName}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <ThumbsUp className="h-4 w-4 text-green-500" />
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </Link>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rating Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Статистика рейтингов
                </CardTitle>
                <CardDescription>
                  Распределение рейтингов по всем отзывам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      recentReviews?.reviews?.filter(
                        (r: PropertyReview) => r.rating === rating
                      ).length || 0;
                    const percentage = recentReviews?.reviews?.length
                      ? Math.round((count / recentReviews.reviews.length) * 100)
                      : 0;

                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 w-16">
                          <span className="text-sm font-medium">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 w-12">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
