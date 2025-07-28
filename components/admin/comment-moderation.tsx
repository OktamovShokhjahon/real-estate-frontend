"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, AlertTriangle, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export function CommentModeration() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("pending");

  const { data, isLoading } = useQuery("admin-comments", async () => {
    const response = await api.get("/admin/comments");
    return response.data;
  });

  const moderateComment = useMutation(
    async ({
      type,
      reviewId,
      commentId,
      action,
    }: {
      type: "property" | "tenant";
      reviewId: string;
      commentId: string;
      action: "approve" | "reject" | "delete";
    }) => {
      await api.patch(
        `/admin/${type}-reviews/${reviewId}/comments/${commentId}/moderate`,
        { action }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-comments");
        toast.success("Комментарий успешно модерирован");
      },
      onError: () => {
        toast.error("Не удалось модерировать комментарий");
      },
    }
  );

  if (isLoading) {
    return <div className="text-center py-8">Загрузка комментариев...</div>;
  }

  const propertyComments = data?.propertyComments || [];
  const tenantComments = data?.tenantComments || [];

  function filterComments(list: any[]) {
    if (tab === "pending")
      return list.filter((c) => !c.isApproved && !c.isReported);
    if (tab === "reported") return list.filter((c) => c.isReported);
    if (tab === "approved")
      return list.filter((c) => c.isApproved && !c.isReported);
    return list;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Модерация комментариев
        </CardTitle>
        <CardDescription>
          Проверьте, одобрите или удалите комментарии пользователей
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="pending">Ожидают</TabsTrigger>
            <TabsTrigger value="reported">Жалобы</TabsTrigger>
            <TabsTrigger value="approved">Одобренные</TabsTrigger>
          </TabsList>
          <TabsContent value={tab}>
            <div className="space-y-4">
              {(["property", "tenant"] as ("property" | "tenant")[]).map(
                (type) => {
                  const comments = filterComments(
                    type === "property" ? propertyComments : tenantComments
                  );
                  return (
                    <div key={type}>
                      <h4 className="font-semibold mb-2">
                        {type === "property" ? "Недвижимость" : "Арендаторы"} (
                        {comments.length})
                      </h4>
                      {comments.length === 0 ? (
                        <div className="text-xs text-gray-500 mb-4">
                          Нет комментариев
                        </div>
                      ) : (
                        comments.map((comment: any) => (
                          <div
                            key={comment._id}
                            className="border rounded p-2 bg-gray-50 flex flex-col mb-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">
                                {comment.author?.firstName}{" "}
                                {comment.author?.lastName} •{" "}
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                              <div className="flex gap-2">
                                {!comment.isApproved && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      moderateComment.mutate({
                                        type,
                                        reviewId: comment.reviewId,
                                        commentId: comment._id,
                                        action: "approve",
                                      })
                                    }
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Одобрить
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    moderateComment.mutate({
                                      type,
                                      reviewId: comment.reviewId,
                                      commentId: comment._id,
                                      action: "delete",
                                    })
                                  }
                                >
                                  <X className="h-4 w-4 mr-1" /> Удалить
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-800 mt-1">
                              {comment.text}
                            </div>
                            {comment.isReported && (
                              <div className="text-xs text-red-600 mt-1 flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />{" "}
                                Жалоб: {comment.reportCount || 1}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
