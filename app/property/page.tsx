"use client";

import type React from "react";

import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MapPin, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { EnhancedLocationSearch } from "@/components/enhanced-location-search";
import { RatingDisplay, RatingBadge } from "@/components/ui/rating-display";

interface PropertyComment {
  _id: string;
  author: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  text: string;
  createdAt: string;
  isApproved: boolean;
  isReported?: boolean;
  reportCount?: number;
}

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
  ratings?: {
    apartment?: number;
    residentialComplex?: number;
    courtyard?: number;
    parking?: number;
    infrastructure?: number;
  };
  author: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  comments?: PropertyComment[];
}

export default function PropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  // Redirect if not logged in
  if (!loading && !user) {
    router.push("/login");
    return null;
  }
  if (loading) {
    return <div className="text-center py-16">Загрузка...</div>;
  }

  const [searchParams, setSearchParams] = useState({
    city: "",
    street: "",
    building: "",
    rooms: "",
  });

  const { data, isLoading, refetch } = useQuery(
    ["property-reviews", searchParams],
    async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/property/reviews?${params}`);
      return response.data;
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Make city input a simple input as well
  // Remove LocationSearch, use simple input for city and street
  // Remove handleCityChange

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Отзывы о недвижимости</h1>
        <p className="text-gray-600">
          Ищите отзывы о квартирах, зданиях и районах
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Поиск недвижимости
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Город</Label>
                <Input
                  id="city"
                  name="city"
                  value={searchParams.city}
                  onChange={handleInputChange}
                  placeholder="Введите город"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Улица</Label>
                <Input
                  id="street"
                  name="street"
                  value={searchParams.street}
                  onChange={handleInputChange}
                  placeholder="Введите улицу"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="building">Здание</Label>
                <Input
                  id="building"
                  name="building"
                  value={searchParams.building}
                  onChange={handleInputChange}
                  placeholder="Номер здания"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rooms">Комнаты</Label>
                <Input
                  id="rooms"
                  name="rooms"
                  type="number"
                  min="1"
                  max="8"
                  value={searchParams.rooms}
                  onChange={handleInputChange}
                  placeholder="Количество комнат"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Поиск
              </Button>
            </div>
          </form>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" asChild>
              <Link href="/property/add">
                <Plus className="h-4 w-4 mr-2" />
                Добавить отзыв
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8">Загрузка...</div>
      ) : (
        <div className="space-y-6">
          {data?.reviews?.length > 0 ? (
            <>
              <div className="text-sm text-gray-600">
                Найдено {data.pagination.total} отзывов
              </div>

              <div className="grid gap-6">
                {data.reviews.map((review: PropertyReview) => {
                  console.log(review);

                  return (
                    <Card key={review._id} style={{ wordBreak: "break-word" }}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                              {review.street} {review.building}, {review.city}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-2">
                              <Badge variant="secondary" className="mr-2">
                                {review.numberOfRooms} комнат
                              </Badge>
                              {review.rating && (
                                <RatingBadge rating={review.rating} />
                              )}
                            </CardDescription>
                          </div>
                          <div className="text-sm text-gray-500">
                            от {review.author.firstName}{" "}
                            {review.author.lastName}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Период аренды: {review.rentalPeriod.from.month}/
                            {review.rentalPeriod.from.year} -{" "}
                            {review.rentalPeriod.to.month}/
                            {review.rentalPeriod.to.year}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Арендодатель: {review.landlordName}
                            </p>
                            <p className="text-gray-700 mb-4">
                              {review.reviewText}
                            </p>

                            {/* Comprehensive Ratings */}
                            {review.ratings && (
                              <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Детальные оценки:
                                </h5>
                                <RatingDisplay
                                  ratings={review.ratings}
                                  compact={true}
                                />
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-500">
                            Опубликовано{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {/* Comments Section */}
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Комментарии</h4>
                          {review.comments &&
                          review.comments.filter((c) => c.isApproved).length >
                            0 ? (
                            <div className="space-y-2">
                              {review.comments.length > 0 &&
                                review.comments
                                  .filter((c) => c.isApproved)
                                  .map((comment) => (
                                    <div
                                      key={comment._id}
                                      className="border rounded p-2 bg-gray-50 dark:bg-zinc-800 flex flex-col"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600 dark:text-gray-300">
                                          {comment.author.firstName}{" "}
                                          {comment.author.lastName} •{" "}
                                          {new Date(
                                            comment.createdAt
                                          ).toLocaleString()}
                                        </span>
                                        <button
                                          className="text-xs text-red-500 hover:underline ml-2"
                                          onClick={async () => {
                                            await api.post(
                                              `/property/reviews/${review._id}/comments/${comment._id}/report`
                                            );
                                            alert(
                                              "Комментарий отправлен на модерацию"
                                            );
                                          }}
                                          title="Пожаловаться на комментарий"
                                        >
                                          Пожаловаться
                                        </button>
                                      </div>
                                      <div className="text-sm text-gray-800 dark:text-gray-100 mt-1">
                                        {comment.text}
                                      </div>
                                    </div>
                                  ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">
                              Комментариев пока нет.
                            </div>
                          )}
                          {/* Add Comment Form */}
                          <AddCommentForm reviewId={review._id} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Отзывы не найдены</p>
              <Button asChild>
                <Link href="/property/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Будьте первым, кто добавит отзыв
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddCommentForm({ reviewId }: { reviewId: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.post(`/property/reviews/${reviewId}/comments`, { text });
      setText("");
      setSuccess(true);
    } catch (err) {
      alert("Ошибка при добавлении комментария");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <textarea
        className="border rounded p-2 text-sm"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишите комментарий..."
        required
        maxLength={1000}
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={loading || !text.trim()}>
          {loading ? "Отправка..." : "Добавить комментарий"}
        </Button>
        {success && (
          <span className="text-green-600 text-xs">
            Комментарий отправлен на модерацию
          </span>
        )}
      </div>
    </form>
  );
}
