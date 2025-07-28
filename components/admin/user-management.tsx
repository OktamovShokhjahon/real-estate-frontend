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
import { Input } from "@/components/ui/input";
import { Users, Search, UserCheck, UserX, Mail, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export function UserManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: users, isLoading } = useQuery("admin-users", async () => {
    const response = await api.get("/admin/users");
    return response.data;
  });

  const updateUserStatus = useMutation(
    async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await api.patch(`/admin/users/${userId}/status`, { isActive });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-users");
        toast.success("Статус пользователя успешно обновлён");
      },
      onError: () => {
        toast.error("Не удалось обновить статус пользователя");
      },
    }
  );

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    setLoadingActions((prev) => ({ ...prev, [userId]: true }));

    try {
      await updateUserStatus.mutateAsync({ userId, isActive: !currentStatus });
    } finally {
      setLoadingActions((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const filteredUsers =
    users?.filter(
      (user: any) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Загрузка пользователей...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Управление пользователями ({users?.length || 0})
          </CardTitle>
          <CardDescription>
            Управляйте аккаунтами пользователей и их правами
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск пользователей по имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                {searchTerm
                  ? "Пользователи, соответствующие вашему запросу, не найдены"
                  : "Пользователи не найдены"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user: any) => (
            <Card key={user._id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Активен" : "Неактивен"}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Зарегистрирован{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Последний вход{" "}
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={user.isActive ? "destructive" : "default"}
                      onClick={() =>
                        handleStatusToggle(user._id, user.isActive)
                      }
                      disabled={loadingActions[user._id]}
                    >
                      {user.isActive ? (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          {loadingActions[user._id] ? "..." : "Деактивировать"}
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          {loadingActions[user._id] ? "..." : "Активировать"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
