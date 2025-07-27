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
import { Activity, Users, FileText } from "lucide-react";

export function ActivityChart() {
  const { data: activityData, isLoading } = useQuery(
    "activity-stats",
    async () => {
      const response = await api.get("/admin/activity-stats");
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = activityData?.dailyActivity || [];

  // Calculate totals for the period
  const totals = chartData.reduce(
    (acc: any, day: any) => ({
      users: acc.users + day.users,
      propertyReviews: acc.propertyReviews + day.propertyReviews,
      tenantReviews: acc.tenantReviews + day.tenantReviews,
    }),
    { users: 0, propertyReviews: 0, tenantReviews: 0 }
  );

  const maxValue = Math.max(
    ...chartData.map((d: any) =>
      Math.max(d.users, d.propertyReviews, d.tenantReviews)
    )
  );

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Daily Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No activity data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              30-Day User Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.users}</div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(totals.users / 30)} per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              30-Day Property Reviews
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.propertyReviews}</div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(totals.propertyReviews / 30)} per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              30-Day Tenant Reviews
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.tenantReviews}</div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(totals.tenantReviews / 30)} per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Daily Activity (Last 30 Days)
          </CardTitle>
          <CardDescription>
            User registrations and review submissions over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Property Reviews</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span>Tenant Reviews</span>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end justify-between space-x-1 bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {chartData.map((day: any, index: number) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center space-y-1 min-w-0 flex-1"
                >
                  <div className="flex items-end space-x-0.5 h-48">
                    {/* Users bar */}
                    <div
                      className="bg-blue-500 rounded-t w-2 transition-all duration-300 hover:bg-blue-600"
                      style={{
                        height:
                          maxValue > 0
                            ? `${(day.users / maxValue) * 100}%`
                            : "0%",
                      }}
                      title={`${day.users} users`}
                    />
                    {/* Property reviews bar */}
                    <div
                      className="bg-green-500 rounded-t w-2 transition-all duration-300 hover:bg-green-600"
                      style={{
                        height:
                          maxValue > 0
                            ? `${(day.propertyReviews / maxValue) * 100}%`
                            : "0%",
                      }}
                      title={`${day.propertyReviews} property reviews`}
                    />
                    {/* Tenant reviews bar */}
                    <div
                      className="bg-purple-500 rounded-t w-2 transition-all duration-300 hover:bg-purple-600"
                      style={{
                        height:
                          maxValue > 0
                            ? `${(day.tenantReviews / maxValue) * 100}%`
                            : "0%",
                      }}
                      title={`${day.tenantReviews} tenant reviews`}
                    />
                  </div>
                  <div className="text-xs text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Peak User Registration Day
                    </p>
                    <p className="text-xs text-blue-700">
                      {chartData.length > 0
                        ? chartData.reduce((max: any, day: any) =>
                            day.users > max.users ? day : max
                          ).date
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {chartData.length > 0
                      ? Math.max(...chartData.map((d: any) => d.users))
                      : 0}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Peak Review Day
                    </p>
                    <p className="text-xs text-green-700">
                      {chartData.length > 0
                        ? chartData.reduce((max: any, day: any) =>
                            day.propertyReviews + day.tenantReviews >
                            max.propertyReviews + max.tenantReviews
                              ? day
                              : max
                          ).date
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {chartData.length > 0
                      ? Math.max(
                          ...chartData.map(
                            (d: any) => d.propertyReviews + d.tenantReviews
                          )
                        )
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
