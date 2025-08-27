"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { api, addressApi } from "@/lib/api";
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
import { RatingSelect } from "@/components/ui/rating-select";

// Custom City and Street Autocomplete with "Add as is" option
function CityAutocomplete({
  value,
  onValueChange,
  label,
}: {
  value: string;
  onValueChange: (v: string) => void;
  label?: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch city suggestions
  const fetchCities = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://prokvartiru.kz/api/addresses/search?q=${encodeURIComponent(
          q
        )}&limit=5`
      );
      const data = await res.json();
      // The API returns array of objects with .city property
      const cities = Array.isArray(data)
        ? data.map((item: any) => item.city).filter(Boolean)
        : [];
      setSuggestions(cities);
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.length > 0) {
      fetchCities(val);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Handle selection from dropdown
  const handleSelect = (city: string) => {
    setInputValue(city);
    onValueChange(city);
    setShowDropdown(false);
  };

  // Handle blur: if not in suggestions, allow as is
  const handleBlur = () => {
    setTimeout(() => {
      onValueChange(inputValue.trim());
      setShowDropdown(false);
    }, 100); // Delay to allow click on dropdown
  };

  return (
    <div className="relative">
      {label && <Label htmlFor="city">{label}</Label>}
      <Input
        id="city"
        name="city"
        autoComplete="off"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => {
          if (inputValue.length > 0) setShowDropdown(true);
        }}
        onBlur={handleBlur}
        required
        placeholder="Введите город"
        className="bg-white dark:bg-[#020817] text-black dark:text-white"
      />
      {showDropdown &&
        (suggestions.length > 0 || inputValue.trim().length > 0) && (
          <div className="absolute z-10 bg-white dark:bg-[#020817] border border-gray-200 dark:border-gray-700 rounded shadow w-full mt-1 max-h-48 overflow-auto">
            {loading && (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-300 text-sm">
                Загрузка...
              </div>
            )}
            {suggestions.map((city) => (
              <div
                key={city}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
                onMouseDown={() => handleSelect(city)}
              >
                {city}
              </div>
            ))}
            {/* If inputValue is not in suggestions, show "Add as is" */}
            {inputValue.trim().length > 0 &&
              !suggestions.includes(inputValue.trim()) && (
                <div
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
                  onMouseDown={() => handleSelect(inputValue.trim())}
                >
                  Добавить: <b>{inputValue.trim()}</b>
                </div>
              )}
          </div>
        )}
    </div>
  );
}

function StreetAutocomplete({
  value,
  onValueChange,
  cityValue,
  label,
}: {
  value: string;
  onValueChange: (v: string) => void;
  cityValue: string;
  label?: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch street suggestions
  const fetchStreets = async (q: string) => {
    setLoading(true);
    try {
      // Compose query with city if available
      let query = q;
      if (cityValue) {
        query = `${q}, ${cityValue}`;
      }
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=10&featuretype=street`
      );
      const data = await res.json();
      // Extract street names from results
      const streets = Array.isArray(data)
        ? Array.from(
            new Set(
              data
                .map((item: any) => {
                  // Try to get street name from address
                  if (item.address && item.address.road) {
                    return item.address.road;
                  }
                  // fallback to display_name
                  if (item.display_name) {
                    // Try to extract street from display_name
                    return item.display_name.split(",")[0];
                  }
                  return null;
                })
                .filter(Boolean)
            )
          )
        : [];
      setSuggestions(streets);
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.length > 0) {
      fetchStreets(val);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Handle selection from dropdown
  const handleSelect = (street: string) => {
    setInputValue(street);
    onValueChange(street);
    setShowDropdown(false);
  };

  // Handle blur: if not in suggestions, allow as is
  const handleBlur = () => {
    setTimeout(() => {
      onValueChange(inputValue.trim());
      setShowDropdown(false);
    }, 100); // Delay to allow click on dropdown
  };

  return (
    <div className="relative">
      {label && <Label htmlFor="street">{label}</Label>}
      <Input
        id="street"
        name="street"
        autoComplete="off"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => {
          if (inputValue.length > 0) setShowDropdown(true);
        }}
        onBlur={handleBlur}
        required
        placeholder="Введите улицу"
      />
      {showDropdown &&
        (suggestions.length > 0 || inputValue.trim().length > 0) && (
          <div className="absolute z-10 bg-white border border-gray-200 rounded shadow w-full mt-1 max-h-48 overflow-auto">
            {loading && (
              <div className="px-3 py-2 text-gray-500 text-sm">Загрузка...</div>
            )}
            {suggestions.map((street) => (
              <div
                key={street}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => handleSelect(street)}
              >
                {street}
              </div>
            ))}
            {/* If inputValue is not in suggestions, show "Add as is" */}
            {inputValue.trim().length > 0 &&
              !suggestions.includes(inputValue.trim()) && (
                <div
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-blue-600"
                  onMouseDown={() => handleSelect(inputValue.trim())}
                >
                  Добавить: <b>{inputValue.trim()}</b>
                </div>
              )}
          </div>
        )}
    </div>
  );
}

export default function AddPropertyReviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    building: "",
    residentialComplex: "",
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
    ratings: {
      apartment: "",
      residentialComplex: "",
      courtyard: "",
      parking: "",
      infrastructure: "",
    },
  });

  // New state to track if this is a ЖК-only review
  const [isResidentialComplexOnly, setIsResidentialComplexOnly] =
    useState(false);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate: if not ЖК-only, numberOfRooms is required
    if (!isResidentialComplexOnly && !formData.numberOfRooms) {
      toast.error("Пожалуйста, укажите количество комнат.");
      setLoading(false);
      return;
    }

    // Validate: if not ЖК-only, landlordName is required
    if (!isResidentialComplexOnly && !formData.landlordName.trim()) {
      toast.error("Пожалуйста, укажите имя арендодателя.");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        numberOfRooms: formData.numberOfRooms
          ? Number.parseInt(formData.numberOfRooms)
          : undefined,
        floor: formData.floor ? Number.parseInt(formData.floor) : undefined,
        rating: formData.rating ? Number.parseInt(formData.rating) : undefined,
        ratings: {
          apartment: formData.ratings.apartment
            ? Number.parseInt(formData.ratings.apartment)
            : undefined,
          residentialComplex: formData.ratings.residentialComplex
            ? Number.parseInt(formData.ratings.residentialComplex)
            : undefined,
          courtyard: formData.ratings.courtyard
            ? Number.parseInt(formData.ratings.courtyard)
            : undefined,
          parking: formData.ratings.parking
            ? Number.parseInt(formData.ratings.parking)
            : undefined,
          infrastructure: formData.ratings.infrastructure
            ? Number.parseInt(formData.ratings.infrastructure)
            : undefined,
        },
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
        isResidentialComplexOnly,
      };

      await api.post("/property/reviews", submitData);

      // Also save the address to remembered addresses
      try {
        await addressApi.saveRememberedAddress({
          city: formData.city,
          street: formData.street,
          building: formData.building,
          residentialComplex: formData.residentialComplex,
        });
      } catch (addressError) {
        console.error("Error saving remembered address:", addressError);
        // Don't fail the form submission if address saving fails
      }

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

  // For city and street, update both local and formData state
  const handleCityChange = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      city,
      // Clear street when city changes
      street: "",
    }));
  };

  const handleStreetChange = (street: string) => {
    setFormData((prev) => ({
      ...prev,
      street,
    }));
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

              <div className="mb-2">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isResidentialComplexOnly}
                    onChange={(e) => {
                      setIsResidentialComplexOnly(e.target.checked);
                      // If switching to ЖК-only, clear numberOfRooms and landlordName
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          numberOfRooms: "",
                          landlordName: "",
                        }));
                      }
                    }}
                  />
                  <span>
                    Я хочу оставить отзыв только о жилом комплексе (ЖК)
                  </span>
                </label>
                <div className="text-xs text-gray-500 mt-1">
                  Если вы не указываете квартиру, поля "количество комнат",
                  "этаж", "номер квартиры" не обязательны. Имя арендодателя
                  также не обязательно.
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <CityAutocomplete
                    value={formData.city}
                    onValueChange={handleCityChange}
                    label="Город *"
                  />
                </div>

                <div className="space-y-2">
                  <StreetAutocomplete
                    value={formData.street}
                    onValueChange={handleStreetChange}
                    cityValue={formData.city}
                    label="Улица *"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="residentialComplex">Жилой комплекс</Label>
                  <Input
                    id="residentialComplex"
                    name="residentialComplex"
                    value={formData.residentialComplex}
                    onChange={handleInputChange}
                    placeholder="Название жилого комплекса (необязательно)"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Этаж</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleInputChange}
                    disabled={isResidentialComplexOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartmentNumber">Номер квартиры</Label>
                  <Input
                    id="apartmentNumber"
                    name="apartmentNumber"
                    value={formData.apartmentNumber}
                    onChange={handleInputChange}
                    disabled={isResidentialComplexOnly}
                  />
                </div>
              </div>

              {!isResidentialComplexOnly && (
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
                          {num === 1
                            ? "комната"
                            : num < 5
                            ? "комнаты"
                            : "комнат"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                <Label htmlFor="landlordName">
                  Имя арендодателя
                  {!isResidentialComplexOnly && <span> *</span>}
                </Label>
                <Input
                  id="landlordName"
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleInputChange}
                  required={!isResidentialComplexOnly}
                  disabled={isResidentialComplexOnly}
                  placeholder={
                    isResidentialComplexOnly
                      ? "Необязательно для отзыва о ЖК"
                      : undefined
                  }
                />
              </div>

              {/* Comprehensive Rating System */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">
                  Рейтинги (необязательно)
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <RatingSelect
                    value={formData.ratings.apartment}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        ratings: { ...prev.ratings, apartment: value },
                      }))
                    }
                    label="Квартира"
                    placeholder="Оцените квартиру"
                  />

                  <RatingSelect
                    value={formData.ratings.residentialComplex}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        ratings: { ...prev.ratings, residentialComplex: value },
                      }))
                    }
                    label="Жилой комплекс"
                    placeholder="Оцените жилой комплекс"
                  />

                  <RatingSelect
                    value={formData.ratings.courtyard}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        ratings: { ...prev.ratings, courtyard: value },
                      }))
                    }
                    label="Двор"
                    placeholder="Оцените двор"
                  />

                  <RatingSelect
                    value={formData.ratings.parking}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        ratings: { ...prev.ratings, parking: value },
                      }))
                    }
                    label="Парковка"
                    placeholder="Оцените парковку"
                  />

                  <RatingSelect
                    value={formData.ratings.infrastructure}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        ratings: { ...prev.ratings, infrastructure: value },
                      }))
                    }
                    label="Инфраструктура"
                    placeholder="Оцените инфраструктуру"
                  />
                </div>
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
