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

  // Считаем итоги за период
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
            Дневная активность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Нет доступных данных об активности</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Карточки с итогами активности */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Регистрации пользователей за 30 дней
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.users}</div>
            <p className="text-xs text-muted-foreground">
              В среднем {Math.round(totals.users / 30)} в день
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Отзывы о недвижимости за 30 дней
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.propertyReviews}</div>
            <p className="text-xs text-muted-foreground">
              В среднем {Math.round(totals.propertyReviews / 30)} в день
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Отзывы о жильцах за 30 дней
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.tenantReviews}</div>
            <p className="text-xs text-muted-foreground">
              В среднем {Math.round(totals.tenantReviews / 30)} в день
            </p>
          </CardContent>
        </Card>
      </div>

      {/* График активности */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Дневная активность (последние 30 дней)
          </CardTitle>
          <CardDescription>
            Регистрации пользователей и публикация отзывов по дням
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Легенда */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Пользователи</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Отзывы о недвижимости</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span>Отзывы о жильцах</span>
              </div>
            </div>

            {/* Простой столбчатый график */}
            <div className="h-64 flex items-end justify-between space-x-1 bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {chartData.map((day: any, index: number) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center space-y-1 min-w-0 flex-1"
                >
                  <div className="flex items-end space-x-0.5 h-48">
                    {/* Столбец пользователей */}
                    <div
                      className="bg-blue-500 rounded-t w-2 transition-all duration-300 hover:bg-blue-600"
                      style={{
                        height:
                          maxValue > 0
                            ? `${(day.users / maxValue) * 100}%`
                            : "0%",
                      }}
                      title={`${day.users} пользователей`}
                    />
                    {/* Столбец отзывов о недвижимости */}
                    <div
                      className="bg-green-500 rounded-t w-2 transition-all duration-300 hover:bg-green-600"
                      style={{
                        height:
                          maxValue > 0
                            ? `${(day.propertyReviews / maxValue) * 100}%`
                            : "0%",
                      }}
                      title={`${day.propertyReviews} отзывов о недвижимости`}
                    />
                    {/* Столбец отзывов о жильцах */}
                    <div
                      className="bg-purple-500 rounded-t w-2 transition-all duration-300 hover:bg-purple-600"
                      style={{
                        height:
                          maxValue > 0
                            ? `${(day.tenantReviews / maxValue) * 100}%`
                            : "0%",
                      }}
                      title={`${day.tenantReviews} отзывов о жильцах`}
                    />
                  </div>
                  <div className="text-xs text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {new Date(day.date).toLocaleDateString("ru-RU", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Последние пики активности */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      День пика регистраций пользователей
                    </p>
                    <p className="text-xs text-blue-700">
                      {chartData.length > 0
                        ? new Date(
                            chartData.reduce((max: any, day: any) =>
                              day.users > max.users ? day : max
                            ).date
                          ).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Н/Д"}
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
                      День пика отзывов
                    </p>
                    <p className="text-xs text-green-700">
                      {chartData.length > 0
                        ? new Date(
                            chartData.reduce((max: any, day: any) =>
                              day.propertyReviews + day.tenantReviews >
                              max.propertyReviews + max.tenantReviews
                                ? day
                                : max
                            ).date
                          ).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Н/Д"}
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
