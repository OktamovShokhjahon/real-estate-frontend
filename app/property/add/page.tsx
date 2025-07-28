"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

export default function AddPropertyReviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    building: "",
    floor: "",
    apartmentNumber: "",
    numberOfRooms: "",
    rentalPeriod: {
      from: { month: "", year: "" },
      to: { month: "", year: "" },
    },
    landlordName: "",
    reviewText: "",
    rating: "",
  });

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        numberOfRooms: Number.parseInt(formData.numberOfRooms),
        floor: formData.floor ? Number.parseInt(formData.floor) : undefined,
        rating: formData.rating ? Number.parseInt(formData.rating) : undefined,
        rentalPeriod: {
          from: {
            month: Number.parseInt(formData.rentalPeriod.from.month),
            year: Number.parseInt(formData.rentalPeriod.from.year),
          },
          to: {
            month: Number.parseInt(formData.rentalPeriod.to.month),
            year: Number.parseInt(formData.rentalPeriod.to.year),
          },
        },
      };

      await api.post("/property/reviews", submitData);
      toast.success("Отзыв успешно отправлен!");
      router.push("/property");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Не удалось отправить отзыв"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: grandchild
            ? {
                ...(prev[parent as keyof typeof prev] as any)[child],
                [grandchild]: value,
              }
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const months = [
    { value: "1", label: "Январь" },
    { value: "2", label: "Февраль" },
    { value: "3", label: "Март" },
    { value: "4", label: "Апрель" },
    { value: "5", label: "Май" },
    { value: "6", label: "Июнь" },
    { value: "7", label: "Июль" },
    { value: "8", label: "Август" },
    { value: "9", label: "Сентябрь" },
    { value: "10", label: "Октябрь" },
    { value: "11", label: "Ноябрь" },
    { value: "12", label: "Декабрь" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Добавить отзыв о недвижимости</CardTitle>
          <CardDescription>
            Поделитесь своим опытом аренды недвижимости
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Данные о недвижимости</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Город *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Улица *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building">Дом *</Label>
                  <Input
                    id="building"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Этаж</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartmentNumber">Номер квартиры</Label>
                  <Input
                    id="apartmentNumber"
                    name="apartmentNumber"
                    value={formData.apartmentNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfRooms">Количество комнат *</Label>
                <Select
                  value={formData.numberOfRooms}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, numberOfRooms: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите количество комнат" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}{" "}
                        {num === 1 ? "комната" : num < 5 ? "комнаты" : "комнат"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rental Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Период аренды</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>С *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={formData.rentalPeriod.from.month}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          rentalPeriod: {
                            ...prev.rentalPeriod,
                            from: { ...prev.rentalPeriod.from, month: value },
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Месяц" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.rentalPeriod.from.year}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          rentalPeriod: {
                            ...prev.rentalPeriod,
                            from: { ...prev.rentalPeriod.from, year: value },
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Год" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>По *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={formData.rentalPeriod.to.month}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          rentalPeriod: {
                            ...prev.rentalPeriod,
                            to: { ...prev.rentalPeriod.to, month: value },
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Месяц" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.rentalPeriod.to.year}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          rentalPeriod: {
                            ...prev.rentalPeriod,
                            to: { ...prev.rentalPeriod.to, year: value },
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Год" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Детали отзыва</h3>

              <div className="space-y-2">
                <Label htmlFor="landlordName">Имя арендодателя *</Label>
                <Input
                  id="landlordName"
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Рейтинг (необязательно)</Label>
                <Select
                  value={formData.rating}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, rating: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите рейтинг" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating}{" "}
                        {rating === 1
                          ? "звезда"
                          : rating < 5
                          ? "звезды"
                          : "звезд"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewText">Отзыв *</Label>
                <Textarea
                  id="reviewText"
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleInputChange}
                  placeholder="Опишите квартиру, все плюсы и минусы за время аренды, а также ваш опыт взаимодействия с арендодателем."
                  rows={6}
                  maxLength={5000}
                  required
                />
                <div className="text-sm text-gray-500 text-right">
                  {formData.reviewText.length}/5000 символов
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Отправка..." : "Отправить отзыв"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
