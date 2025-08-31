"use client";

import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Clock,
  AlertTriangle,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminStats } from "@/components/admin/admin-stats";
import { PendingReviews } from "@/components/admin/pending-reviews";
import { UserManagement } from "@/components/admin/user-management";
import { ReportedContent } from "@/components/admin/reported-content";
import { CommentModeration } from "@/components/admin/comment-moderation";

export default function AdminPage() {
  const { user, loading } = useAuth(); // Make sure useAuth provides loading state
  const router = useRouter();

  if (loading) {
    return <div className="text-center py-16">Загрузка...</div>;
  }

  if (!user) {
    router.push("/login.html");
    return null;
  }

  if (user.role !== "admin" && user.role !== "moderator") {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Доступ запрещен
        </h1>
        <p className="text-gray-600">
          У вас нет прав для доступа к панели администратора.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-gray-600 mt-1">
            Управление отзывами, пользователями и мониторинг активности
            платформы
          </p>
        </div>
        <Badge variant="secondary" className="w-fit mt-2 sm:mt-0">
          {user.role === "admin" ? "Администратор" : "Модератор"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Обзор</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Модерация</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Пользователи</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Жалобы</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Комментарии</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminStats />
        </TabsContent>

        <TabsContent value="moderation">
          <PendingReviews />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="reports">
          <ReportedContent />
        </TabsContent>

        <TabsContent value="comments">
          <CommentModeration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
