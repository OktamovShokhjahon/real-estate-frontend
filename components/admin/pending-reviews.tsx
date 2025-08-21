"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, User, Calendar, Check, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

export function PendingReviews() {
  const queryClient = useQueryClient();
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: pendingReviews, isLoading } = useQuery(
    "pending-reviews",
    async () => {
      const response = await api.get("/admin/pending-reviews");
      return response.data;
    }
  );

  const moderatePropertyReview = useMutation(
    async ({ id, action }: { id: string; action: "approve" | "reject" }) => {
      await api.patch(`/admin/property-reviews/${id}/moderate`, { action });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pending-reviews");
        queryClient.invalidateQueries("admin-stats");
        toast.success("Отзыв успешно модерирован");
      },
      onError: () => {
        toast.error("Не удалось модерировать отзыв");
      },
    }
  );

  const moderateTenantReview = useMutation(
    async ({ id, action }: { id: string; action: "approve" | "reject" }) => {
      await api.patch(`/admin/tenant-reviews/${id}/moderate`, { action });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pending-reviews");
        queryClient.invalidateQueries("admin-stats");
        toast.success("Отзыв успешно модерирован");
      },
      onError: () => {
        toast.error("Не удалось модерировать отзыв");
      },
    }
  );

  const handleModerate = async (
    id: string,
    action: "approve" | "reject",
    type: "property" | "tenant"
  ) => {
    setLoadingActions((prev) => ({ ...prev, [`${id}-${action}`]: true }));

    try {
      if (type === "property") {
        await moderatePropertyReview.mutateAsync({ id, action });
      } else {
        await moderateTenantReview.mutateAsync({ id, action });
      }
    } finally {
      setLoadingActions((prev) => ({ ...prev, [`${id}-${action}`]: false }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Загрузка ожидающих отзывов...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const propertyReviews = pendingReviews?.propertyReviews || [];
  const tenantReviews = pendingReviews?.tenantReviews || [];
  const totalPending = propertyReviews.length + tenantReviews.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Ожидающие отзывы ({totalPending})
          </CardTitle>
          <CardDescription>
            Отзывы, ожидающие одобрения модерации
          </CardDescription>
        </CardHeader>
      </Card>

      {totalPending === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Нет ожидающих отзывов</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="property" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="property" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Недвижимость ({propertyReviews.length})
            </TabsTrigger>
            <TabsTrigger value="tenant" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Арендатор ({tenantReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property" className="space-y-4">
            {propertyReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    Нет ожидающих отзывов о недвижимости
                  </p>
                </CardContent>
              </Card>
            ) : (
              propertyReviews.map((review: any) => {
                console.log(review);

                return (
                  <Card key={review._id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2">
                          <CardTitle className="flex items-center text-lg">
                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                            {review.street} {review.building}, {review.city}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                              {review.numberOfRooms} комн.
                            </Badge>
                            <span className="text-sm text-gray-600">
                              от {review.author.firstName}{" "}
                              {review.author.lastName}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleModerate(review._id, "approve", "property")
                            }
                            disabled={loadingActions[`${review._id}-approve`]}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {loadingActions[`${review._id}-approve`]
                              ? "..."
                              : "Одобрить"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleModerate(review._id, "reject", "property")
                            }
                            disabled={loadingActions[`${review._id}-reject`]}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {loadingActions[`${review._id}-reject`]
                              ? "..."
                              : "Отклонить"}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Аренда: {review.rentalPeriod.from.month}/
                          {review.rentalPeriod.from.year} -{" "}
                          {review.rentalPeriod.to.month}/
                          {review.rentalPeriod.to.year}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          Номер квартиры: {review.building}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Арендодатель:</span>{" "}
                          {review.landlordName}
                        </div>
                        <p className="text-gray-700">{review.reviewText}</p>
                        <div className="text-xs text-gray-500">
                          Отправлено:{" "}
                          {new Date(review.createdAt).toLocaleString("ru-RU")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="tenant" className="space-y-4">
            {tenantReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    Нет ожидающих отзывов об арендаторах
                  </p>
                </CardContent>
              </Card>
            ) : (
              tenantReviews.map((review: any) => (
                <Card key={review._id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center text-lg">
                          <User className="h-5 w-5 mr-2 text-green-600" />
                          {review.tenantFullName}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            ИНН: ***{review.tenantIdLastFour}
                          </Badge>
                          <Badge variant="secondary">
                            Телефон: ***{review.tenantPhoneLastFour}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            от {review.author.firstName}{" "}
                            {review.author.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleModerate(review._id, "approve", "tenant")
                          }
                          disabled={loadingActions[`${review._id}-approve`]}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-approve`]
                            ? "..."
                            : "Одобрить"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleModerate(review._id, "reject", "tenant")
                          }
                          disabled={loadingActions[`${review._id}-reject`]}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-reject`]
                            ? "..."
                            : "Отклонить"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Аренда: {review.rentalPeriod.from.month}/
                        {review.rentalPeriod.from.year} -{" "}
                        {review.rentalPeriod.to.month}/
                        {review.rentalPeriod.to.year}
                      </div>
                      <p className="text-gray-700 break-words whitespace-pre-line">
                        {review.reviewText}
                      </p>
                      <div className="text-xs text-gray-500">
                        Отправлено:{" "}
                        {new Date(review.createdAt).toLocaleString("ru-RU")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
