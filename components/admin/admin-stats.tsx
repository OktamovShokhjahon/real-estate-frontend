"use client";

import { useQuery } from "react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { ActivityChart } from "./activity-chart.tsx";
import { CityStats } from "./city-stats.tsx";
import { UserGrowthChart } from "./user-growth-chart.tsx";

export function AdminStats() {
  const { data: stats, isLoading } = useQuery("admin-stats", async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users?.total || 0,
      description: `+${stats?.users?.daily || 0} today`,
      icon: Users,
      color: "text-blue-600",
      change: stats?.users?.weeklyGrowth || 0,
    },
    {
      title: "Property Reviews",
      value: stats?.propertyReviews?.total || 0,
      description: `+${stats?.propertyReviews?.daily || 0} today`,
      icon: MapPin,
      color: "text-green-600",
      change: stats?.propertyReviews?.weeklyGrowth || 0,
    },
    {
      title: "Tenant Reviews",
      value: stats?.tenantReviews?.total || 0,
      description: `+${stats?.tenantReviews?.daily || 0} today`,
      icon: User,
      color: "text-purple-600",
      change: stats?.tenantReviews?.weeklyGrowth || 0,
    },
    {
      title: "Pending Reviews",
      value:
        (stats?.propertyReviews?.pending || 0) +
        (stats?.tenantReviews?.pending || 0),
      description: "Awaiting moderation",
      icon: Clock,
      color: "text-yellow-600",
      change: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {stat.change !== 0 && (
                    <div
                      className={`flex items-center text-xs ${
                        stat.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp
                        className={`h-3 w-3 mr-1 ${
                          stat.change < 0 ? "rotate-180" : ""
                        }`}
                      />
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Statistics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Time Period Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Weekly Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Users</span>
                  <span className="font-semibold">
                    {stats?.users?.weekly || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Property Reviews
                  </span>
                  <span className="font-semibold">
                    {stats?.propertyReviews?.weekly || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tenant Reviews</span>
                  <span className="font-semibold">
                    {stats?.tenantReviews?.weekly || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Monthly Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Users</span>
                  <span className="font-semibold">
                    {stats?.users?.monthly || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Property Reviews
                  </span>
                  <span className="font-semibold">
                    {stats?.propertyReviews?.monthly || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tenant Reviews</span>
                  <span className="font-semibold">
                    {stats?.tenantReviews?.monthly || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Moderation Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Pending Property
                  </span>
                  <span className="font-semibold">
                    {stats?.propertyReviews?.pending || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Tenant</span>
                  <span className="font-semibold">
                    {stats?.tenantReviews?.pending || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Reported Content
                  </span>
                  <span className="font-semibold text-red-600">
                    {(stats?.propertyReviews?.reported || 0) +
                      (stats?.tenantReviews?.reported || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Property Review Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      stats?.propertyReviews?.ratingDistribution?.[rating] || 0;
                    const total = stats?.propertyReviews?.total || 1;
                    const percentage = Math.round((count / total) * 100);

                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">
                          {rating}★
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">
                          {count}
                        </span>
                        <span className="text-sm text-gray-500 w-10">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Tenant Review Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      stats?.tenantReviews?.ratingDistribution?.[rating] || 0;
                    const total = stats?.tenantReviews?.total || 1;
                    const percentage = Math.round((count / total) * 100);

                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">
                          {rating}★
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">
                          {count}
                        </span>
                        <span className="text-sm text-gray-500 w-10">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <ActivityChart />
        </TabsContent>

        <TabsContent value="geography">
          <CityStats />
        </TabsContent>

        <TabsContent value="growth">
          <UserGrowthChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
