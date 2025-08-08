"use client";

import React from "react";
import { useQuery } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Home, Building, Users, Star } from "lucide-react";
import Link from "next/link";
import { recommendationApi } from "@/lib/api";

interface TrendingTopic {
  id: string;
  name: string;
  count: number;
  type: string;
  href: string;
}

const getTopicIcon = (type: string) => {
  switch (type) {
    case "city":
      return <Building className="h-4 w-4" />;
    case "room":
      return <Home className="h-4 w-4" />;
    case "rating":
      return <Star className="h-4 w-4" />;
    case "recent":
      return <Users className="h-4 w-4" />;
    default:
      return <TrendingUp className="h-4 w-4" />;
  }
};

const getTopicColor = (type: string) => {
  switch (type) {
    case "city":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400";
    case "room":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400";
    case "rating":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400";
    case "recent":
      return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400";
  }
};

export function TrendingTopics() {
  const { data: trendingData, isLoading, error } = useQuery(
    ["trending-topics"],
    recommendationApi.getTrendingTopics
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
            Трендовые темы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg border animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !trendingData?.trendingTopics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
            Трендовые темы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Не удалось загрузить трендовые темы</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
          Трендовые темы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {trendingData.trendingTopics.map((topic: TrendingTopic) => (
            <Link
              key={topic.id}
              href={topic.href}
              className="block p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${getTopicColor(topic.type)}`}>
                  {getTopicIcon(topic.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate dark:text-gray-200">
                    {topic.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {topic.count} отзывов
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
