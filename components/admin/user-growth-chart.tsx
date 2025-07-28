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
import { TrendingUp, Users, UserPlus, Calendar, Target } from "lucide-react";

export function UserGrowthChart() {
  const { data: growthData, isLoading } = useQuery("user-growth", async () => {
    const response = await api.get("/admin/user-growth");
    return response.data;
  });

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
      </div>
    );
  }

  const chartData = growthData?.monthlyGrowth || [];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Рост пользователей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Нет данных о росте</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];

  const growthRate =
    previousMonth && previousMonth.newUsers > 0
      ? Math.round(
          ((currentMonth.newUsers - previousMonth.newUsers) /
            previousMonth.newUsers) *
            100
        )
      : 0;

  const maxUsers = Math.max(...chartData.map((d: any) => d.totalUsers));
  const maxNewUsers = Math.max(...chartData.map((d: any) => d.newUsers));

  return (
    <div className="space-y-6">
      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего пользователей
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMonth?.totalUsers?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{currentMonth?.newUsers || 0} за этот месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Месячный рост</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMonth?.newUsers || 0}
            </div>
            <div className="flex items-center">
              <Badge
                variant={growthRate >= 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {growthRate >= 0 ? "+" : ""}
                {growthRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные пользователи
            </CardTitle>
            <UserPlus className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMonth?.activeUsers?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentMonth?.totalUsers > 0
                ? Math.round(
                    (currentMonth?.activeUsers / currentMonth?.totalUsers) * 100
                  )
                : 0}
              % от общего числа
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Коэффициент удержания
            </CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMonth?.retentionRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Месячное удержание</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Динамика роста пользователей
            </CardTitle>
            <CardDescription>
              Общее количество пользователей и новых регистраций по месяцам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span>Всего пользователей</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span>Новые пользователи</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 flex items-end justify-between space-x-1 bg-gray-50 p-4 rounded-lg">
                {chartData.map((month: any, index: number) => (
                  <div
                    key={month.month}
                    className="flex flex-col items-center space-y-1 min-w-0 flex-1"
                  >
                    <div className="flex items-end space-x-0.5 h-48">
                      {/* Total users line (represented as tall thin bar) */}
                      <div
                        className="bg-blue-500 rounded-t w-1 transition-all duration-300 hover:bg-blue-600"
                        style={{
                          height:
                            maxUsers > 0
                              ? `${(month.totalUsers / maxUsers) * 100}%`
                              : "0%",
                        }}
                        title={`${month.totalUsers} всего пользователей`}
                      />
                      {/* New users bar */}
                      <div
                        className="bg-green-500 rounded-t w-3 transition-all duration-300 hover:bg-green-600"
                        style={{
                          height:
                            maxNewUsers > 0
                              ? `${(month.newUsers / maxNewUsers) * 100}%`
                              : "0%",
                        }}
                        title={`${month.newUsers} новых пользователей`}
                      />
                    </div>
                    <div className="text-xs text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {month.month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Метрики вовлеченности пользователей
            </CardTitle>
            <CardDescription>
              Активные пользователи и коэффициенты удержания
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Active Users Chart */}
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Активные пользователи по месяцам
                </h4>
                <div className="space-y-2">
                  {chartData.slice(-6).map((month: any) => {
                    const activePercentage =
                      month.totalUsers > 0
                        ? Math.round(
                            (month.activeUsers / month.totalUsers) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={month.month}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 w-16">
                          {month.month}
                        </span>
                        <div className="flex-1 mx-3">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${activePercentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {month.activeUsers.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Retention Rates */}
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Месячный коэффициент удержания
                </h4>
                <div className="space-y-2">
                  {chartData.slice(-6).map((month: any) => (
                    <div
                      key={month.month}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600 w-16">
                        {month.month}
                      </span>
                      <div className="flex-1 mx-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${month.retentionRate}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {month.retentionRate}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Инсайты по росту
          </CardTitle>
          <CardDescription>Ключевые метрики и анализ трендов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Лучший месяц по росту
                  </p>
                  <p className="text-xs text-blue-700">
                    {chartData.length > 0
                      ? chartData.reduce((max: any, month: any) =>
                          month.newUsers > max.newUsers ? month : max
                        ).month
                      : "Н/Д"}
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  +
                  {chartData.length > 0
                    ? Math.max(...chartData.map((d: any) => d.newUsers))
                    : 0}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Средний месячный рост
                  </p>
                  <p className="text-xs text-green-700">Последние 6 месяцев</p>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {chartData.length >= 6
                    ? Math.round(
                        chartData
                          .slice(-6)
                          .reduce(
                            (sum: number, month: any) => sum + month.newUsers,
                            0
                          ) / 6
                      )
                    : 0}
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Самое высокое удержание
                  </p>
                  <p className="text-xs text-purple-700">
                    {chartData.length > 0
                      ? chartData.reduce((max: any, month: any) =>
                          month.retentionRate > max.retentionRate ? month : max
                        ).month
                      : "Н/Д"}
                  </p>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {chartData.length > 0
                    ? Math.max(...chartData.map((d: any) => d.retentionRate))
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    Темп роста
                  </p>
                  <p className="text-xs text-orange-700">Месяц к месяцу</p>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {growthRate >= 0 ? "+" : ""}
                  {growthRate}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
