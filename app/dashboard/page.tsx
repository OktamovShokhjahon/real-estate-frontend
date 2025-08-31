"use client";

import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "react-query";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, MapPin, User, Calendar, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import React from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Error boundary state
  const [error, setError] = React.useState<null | string>(null);

  // Wait for auth to load before redirecting or rendering
  React.useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/login.html");
    }
  }, [user, isLoading, router]);

  // Don't render anything until auth is loaded
  if (isLoading || user === undefined) {
    return null;
  }
  if (!user) {
    // The redirect will happen in useEffect, so just render nothing
    return null;
  }

  // Error boundary for queries
  let stats, reviews, notificationSettings;
  let statsError, reviewsError, notificationError;

  try {
    ({ data: stats, error: statsError } = useQuery(
      "user-dashboard",
      async () => {
        const response = await api.get("/user/dashboard");
        return response.data;
      }
    ));

    ({ data: reviews, error: reviewsError } = useQuery(
      "user-reviews",
      async () => {
        const response = await api.get("/user/my-reviews");
        return response.data;
      }
    ));

    ({ data: notificationSettings, error: notificationError } = useQuery(
      "user-notifications",
      async () => {
        const response = await api.get("/user/notifications");
        return response.data;
      }
    ));
  } catch (err: any) {
    setError(
      "Произошла ошибка при загрузке данных. Пожалуйста, попробуйте обновить страницу."
    );
  }

  React.useEffect(() => {
    if (statsError || reviewsError || notificationError) {
      setError(
        "Произошла ошибка при загрузке данных. Пожалуйста, попробуйте обновить страницу."
      );
    }
  }, [statsError, reviewsError, notificationError]);

  const queryClient = useQueryClient();

  const updateNotificationMutation = useMutation(
    async (emailNotifications: boolean) => {
      const response = await api.patch("/user/notifications", {
        emailNotifications,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user-notifications");
        toast.success("Настройки уведомлений обновлены");
      },
      onError: () => {
        toast.error("Ошибка при обновлении настроек уведомлений");
      },
    }
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Ошибка</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Обновить страницу
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-gray-600">
          Добро пожаловать, {user.firstName}! Управляйте своими отзывами и
          активностью.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего отзывов</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
            <p className="text-xs text-muted-foreground">За все время</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Отзывы о недвижимости
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.propertyReviewsCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              О квартирах и зданиях
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Отзывы об арендаторах
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.tenantReviewsCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">О людях</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/property/add.html">
                <Plus className="h-4 w-4 mr-2" />
                Добавить отзыв о недвижимости
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tenant/add.html">
                <User className="h-4 w-4 mr-2" />
                Добавить отзыв об арендаторе
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Настройки уведомлений
          </CardTitle>
          <CardDescription>
            Управляйте уведомлениями о комментариях к вашим отзывам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base">
                Email уведомления
              </Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления на email при появлении новых комментариев
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={notificationSettings?.emailNotifications ?? true}
                onCheckedChange={(checked) => {
                  updateNotificationMutation.mutate(checked);
                }}
                disabled={updateNotificationMutation.isLoading}
              />
              {updateNotificationMutation.isLoading && (
                <div className="text-xs text-muted-foreground">
                  Обновление...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Ваши последние отзывы</h2>

        {reviews?.propertyReviews?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Отзывы о недвижимости</h3>
            <div className="grid gap-4">
              {reviews.propertyReviews.slice(0, 3).map((review: any) => (
                <Card key={review._id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {review.street} {review.building}, {review.city}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Badge variant="secondary" className="mr-2">
                        {review.numberOfRooms} комнаты
                      </Badge>
                      <Calendar className="h-4 w-4 mr-1" />
                      {review.rentalPeriod.from.month}/
                      {review.rentalPeriod.from.year} -{" "}
                      {review.rentalPeriod.to.month}/
                      {review.rentalPeriod.to.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.reviewText}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge
                        variant={review.isApproved ? "default" : "secondary"}
                      >
                        {review.isApproved ? "Одобрен" : "Ожидает проверки"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {reviews?.tenantReviews?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Отзывы об арендаторах</h3>
            <div className="grid gap-4">
              {reviews.tenantReviews.slice(0, 3).map((review: any) => (
                <Card key={review._id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      {review.tenantFullName}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {review.rentalPeriod.from.month}/
                      {review.rentalPeriod.from.year} -{" "}
                      {review.rentalPeriod.to.month}/
                      {review.rentalPeriod.to.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.reviewText}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge
                        variant={review.isApproved ? "default" : "secondary"}
                      >
                        {review.isApproved ? "Одобрен" : "Ожидает проверки"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!reviews?.propertyReviews?.length &&
          !reviews?.tenantReviews?.length && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Вы еще не написали ни одного отзыва
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/property/add.html">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить отзыв о недвижимости
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/tenant/add.html">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить отзыв об арендаторе
                  </Link>
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
