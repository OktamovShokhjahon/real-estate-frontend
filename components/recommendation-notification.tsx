"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Heart, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

interface RecommendationNotificationProps {
  onDismiss?: () => void;
}

export function RecommendationNotification({
  onDismiss,
}: RecommendationNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Новые рекомендации
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Новое
                </Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Мы подобрали для вас персональные рекомендации на основе ваших
                предпочтений
              </p>
              <div className="flex items-center space-x-2">
                <Button size="sm" asChild>
                  <Link
                    href="/recommendations"
                    className="flex items-center space-x-1"
                  >
                    <Heart className="h-3 w-3" />
                    <span>Смотреть</span>
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link
                    href="/property"
                    className="flex items-center space-x-1"
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>Популярное</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
