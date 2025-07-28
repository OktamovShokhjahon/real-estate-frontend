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
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

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
}

export function RecentReviews() {
  const { data: propertyData, isLoading: propertyLoading } = useQuery(
    "recent-property-reviews",
    async () => {
      const response = await api.get("/property/reviews?limit=3");
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: tenantData, isLoading: tenantLoading } = useQuery(
    "recent-tenant-reviews",
    async () => {
      const response = await api.get("/tenant/reviews?limit=3");
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const isLoading = propertyLoading || tenantLoading;

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const hasReviews =
    propertyData?.reviews?.length > 0 || tenantData?.reviews?.length > 0;

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Последние отзывы
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Посмотрите, что говорят наши пользователи о недвижимости и арендаторах
        </p>
      </div>

      {!hasReviews ? (
        <div className="text-center py-12">
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg">Отзывы не найдены</p>
            <p className="text-muted-foreground/70">
              Будьте первым, чтобы поделиться своим опытом!
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button asChild>
                <Link href="/property/add">Добавить отзыв о недвижимости</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tenant/add">Добавить отзыв об арендаторе</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Property Reviews */}
          {propertyData?.reviews?.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold flex items-center text-foreground">
                  <MapPin className="h-6 w-6 mr-2 text-primary" />
                  Отзывы о недвижимости
                </h3>
                <Button variant="outline" asChild>
                  <Link href="/property" className="flex items-center">
                    Посмотреть все
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertyData.reviews.map((review: PropertyReview) => (
                  <Card
                    key={review._id}
                    className="hover:shadow-lg transition-all duration-300 border-border bg-card"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start justify-between">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="truncate text-foreground">
                              {review.street} {review.building}
                            </div>
                            <div className="text-sm text-muted-foreground font-normal">
                              {review.city}
                            </div>
                          </div>
                        </div>
                        {review.rating && (
                          <div className="flex items-center ml-2">
                            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                            <span className="text-sm text-foreground">
                              {review.rating}
                            </span>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {review.numberOfRooms} комнат
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          от {review.author.firstName} {review.author.lastName}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {review.rentalPeriod.from.month}/
                          {review.rentalPeriod.from.year} -{" "}
                          {review.rentalPeriod.to.month}/
                          {review.rentalPeriod.to.year}
                        </div>
                        <p className="text-sm text-foreground line-clamp-3">
                          {review.reviewText}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tenant Reviews */}
          {tenantData?.reviews?.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold flex items-center text-foreground">
                  <User className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                  Отзывы об арендаторах
                </h3>
                <Button variant="outline" asChild>
                  <Link href="/tenant" className="flex items-center">
                    Посмотреть все
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenantData.reviews.map((review: TenantReview) => (
                  <Card
                    key={review._id}
                    className="hover:shadow-lg transition-all duration-300 border-border bg-card"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start justify-between">
                        <div className="flex items-center min-w-0">
                          <User className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <div className="truncate text-foreground">
                            {review.tenantFullName}
                          </div>
                        </div>
                        {review.rating && (
                          <div className="flex items-center ml-2">
                            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                            <span className="text-sm text-foreground">
                              {review.rating}
                            </span>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary">
                          ID: ***{review.tenantIdLastFour}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          от {review.author.firstName} {review.author.lastName}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {review.rentalPeriod.from.month}/
                          {review.rentalPeriod.from.year} -{" "}
                          {review.rentalPeriod.to.month}/
                          {review.rentalPeriod.to.year}
                        </div>
                        <p className="text-sm text-foreground line-clamp-3">
                          {review.reviewText}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
