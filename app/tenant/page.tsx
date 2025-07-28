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
import { Search, Plus, User, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface TenantComment {
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

interface TenantReview {
  _id: string;
  tenantFullName: string;
  tenantIdLastFour: string;
  tenantPhoneLastFour: string;
  rentalPeriod: {
    from: { month: number; year: number };
    to: { month: number; year: number };
  };
  reviewText: string;
  rating?: number;
  author: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  comments?: TenantComment[];
}

export default function TenantPage() {
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
    name: "",
    idLastFour: "",
    phoneLastFour: "",
  });

  const { data, isLoading, refetch } = useQuery(
    ["tenant-reviews", searchParams],
    async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/tenant/reviews?${params}`);
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Отзывы об арендаторах</h1>
        <p className="text-gray-600">
          Ищите отзывы об арендаторах, написанные арендодателями
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Поиск арендаторов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Полное имя</Label>
                <Input
                  id="name"
                  name="name"
                  value={searchParams.name}
                  onChange={handleInputChange}
                  placeholder="Введите имя арендатора"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idLastFour">Последние 4 цифры паспорта</Label>
                <Input
                  id="idLastFour"
                  name="idLastFour"
                  value={searchParams.idLastFour}
                  onChange={handleInputChange}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneLastFour">
                  Последние 4 цифры телефона
                </Label>
                <Input
                  id="phoneLastFour"
                  name="phoneLastFour"
                  value={searchParams.phoneLastFour}
                  onChange={handleInputChange}
                  placeholder="5678"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Поиск
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tenant/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить отзыв
                </Link>
              </Button>
            </div>
          </form>
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
                {data.reviews.map((review: TenantReview) => (
                  <Card key={review._id} className="max-w-full overflow-x-auto">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-600" />
                            {review.tenantFullName}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-2 space-x-4">
                            <Badge variant="secondary">
                              Паспорт: ***{review.tenantIdLastFour}
                            </Badge>
                            <Badge variant="secondary">
                              Телефон: ***{review.tenantPhoneLastFour}
                            </Badge>
                            {review.rating && (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span>{review.rating}/5</span>
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-gray-500">
                          от {review.author.firstName} {review.author.lastName}
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

                        <p className="text-gray-700 break-words whitespace-pre-line">
                          {review.reviewText}
                        </p>

                        <div className="text-xs text-gray-500">
                          Опубликовано{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                        {/* Comments Section */}
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Комментарии</h4>
                          {review.comments &&
                          review.comments.filter((c) => c.isApproved).length >
                            0 ? (
                            <div className="space-y-2">
                              {review.comments
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
                                            `/tenant/reviews/${review._id}/comments/${comment._id}/report`
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
                          <AddTenantCommentForm reviewId={review._id} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Отзывы не найдены</p>
              <Button asChild>
                <Link href="/tenant/add">
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

function AddTenantCommentForm({ reviewId }: { reviewId: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.post(`/tenant/reviews/${reviewId}/comments`, { text });
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
