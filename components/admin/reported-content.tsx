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
import {
  MapPin,
  User,
  Calendar,
  Check,
  X,
  AlertTriangle,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

export function ReportedContent() {
  const queryClient = useQueryClient();
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: reportedContent, isLoading } = useQuery(
    "reported-content",
    async () => {
      const response = await api.get("/admin/reported-content");
      return response.data;
    }
  );

  const handleReportedContent = useMutation(
    async ({
      type,
      id,
      action,
    }: {
      type: "property" | "tenant";
      id: string;
      action: "dismiss" | "approve" | "delete";
    }) => {
      await api.patch(`/admin/reported-content/${type}/${id}`, { action });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("reported-content");
        queryClient.invalidateQueries("admin-stats");
        toast.success("Content handled successfully");
      },
      onError: () => {
        toast.error("Failed to handle reported content");
      },
    }
  );

  const handleAction = async (
    type: "property" | "tenant",
    id: string,
    action: "dismiss" | "approve" | "delete"
  ) => {
    setLoadingActions((prev) => ({ ...prev, [`${id}-${action}`]: true }));

    try {
      await handleReportedContent.mutateAsync({ type, id, action });
    } finally {
      setLoadingActions((prev) => ({ ...prev, [`${id}-${action}`]: false }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading reported content...</CardTitle>
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

  const propertyReports = reportedContent?.propertyReviews || [];
  const tenantReports = reportedContent?.tenantReviews || [];
  const totalReports = propertyReports.length + tenantReports.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Reported Content ({totalReports})
          </CardTitle>
          <CardDescription>
            Reviews and comments that have been reported by users
          </CardDescription>
        </CardHeader>
      </Card>

      {totalReports === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No reported content at this time</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="property" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="property" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Property ({propertyReports.length})
            </TabsTrigger>
            <TabsTrigger value="tenant" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Tenant ({tenantReports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property" className="space-y-4">
            {propertyReports.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No reported property reviews</p>
                </CardContent>
              </Card>
            ) : (
              propertyReports.map((review: any) => (
                <Card key={review._id} className="border-red-200">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center text-lg">
                          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                          {review.street} {review.building}, {review.city}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="destructive">
                            {review.reportCount} report
                            {review.reportCount > 1 ? "s" : ""}
                          </Badge>
                          <Badge variant="secondary">
                            {review.numberOfRooms} rooms
                          </Badge>
                          <span className="text-sm text-gray-600">
                            by {review.author.firstName}{" "}
                            {review.author.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleAction("property", review._id, "dismiss")
                          }
                          disabled={loadingActions[`${review._id}-dismiss`]}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-dismiss`]
                            ? "..."
                            : "Dismiss"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAction("property", review._id, "approve")
                          }
                          disabled={loadingActions[`${review._id}-approve`]}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-approve`]
                            ? "..."
                            : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleAction("property", review._id, "delete")
                          }
                          disabled={loadingActions[`${review._id}-delete`]}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-delete`]
                            ? "..."
                            : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Rental: {review.rentalPeriod.from.month}/
                        {review.rentalPeriod.from.year} -{" "}
                        {review.rentalPeriod.to.month}/
                        {review.rentalPeriod.to.year}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Landlord:</span>{" "}
                        {review.landlordName}
                      </div>
                      <p className="text-gray-700">{review.reviewText}</p>
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(review.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="tenant" className="space-y-4">
            {tenantReports.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No reported tenant reviews</p>
                </CardContent>
              </Card>
            ) : (
              tenantReports.map((review: any) => (
                <Card key={review._id} className="border-red-200">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center text-lg">
                          <User className="h-5 w-5 mr-2 text-green-600" />
                          {review.tenantFullName}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="destructive">
                            {review.reportCount} report
                            {review.reportCount > 1 ? "s" : ""}
                          </Badge>
                          <Badge variant="secondary">
                            ID: ***{review.tenantIdLastFour}
                          </Badge>
                          <Badge variant="secondary">
                            Phone: ***{review.tenantPhoneLastFour}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            by {review.author.firstName}{" "}
                            {review.author.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleAction("tenant", review._id, "dismiss")
                          }
                          disabled={loadingActions[`${review._id}-dismiss`]}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-dismiss`]
                            ? "..."
                            : "Dismiss"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAction("tenant", review._id, "approve")
                          }
                          disabled={loadingActions[`${review._id}-approve`]}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-approve`]
                            ? "..."
                            : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleAction("tenant", review._id, "delete")
                          }
                          disabled={loadingActions[`${review._id}-delete`]}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {loadingActions[`${review._id}-delete`]
                            ? "..."
                            : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Rental: {review.rentalPeriod.from.month}/
                        {review.rentalPeriod.from.year} -{" "}
                        {review.rentalPeriod.to.month}/
                        {review.rentalPeriod.to.year}
                      </div>
                      <p className="text-gray-700">{review.reviewText}</p>
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(review.createdAt).toLocaleString()}
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
