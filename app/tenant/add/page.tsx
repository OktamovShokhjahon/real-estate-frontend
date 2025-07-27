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

export default function AddTenantReviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenantFullName: "",
    tenantIdLastFour: "",
    tenantPhoneLastFour: "",
    rentalPeriod: {
      from: { month: "", year: "" },
      to: { month: "", year: "" },
    },
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

      await api.post("/tenant/reviews", submitData);
      toast.success("Review submitted successfully!");
      router.push("/tenant");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
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
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Tenant Review</CardTitle>
          <CardDescription>
            Share your experience about a tenant as a landlord
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tenant Details</h3>

              <div className="space-y-2">
                <Label htmlFor="tenantFullName">Tenant Full Name *</Label>
                <Input
                  id="tenantFullName"
                  name="tenantFullName"
                  value={formData.tenantFullName}
                  onChange={handleInputChange}
                  placeholder="Enter tenant's full name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantIdLastFour">
                    Last 4 digits of National ID *
                  </Label>
                  <Input
                    id="tenantIdLastFour"
                    name="tenantIdLastFour"
                    value={formData.tenantIdLastFour}
                    onChange={handleInputChange}
                    placeholder="1234"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantPhoneLastFour">
                    Last 4 digits of Phone *
                  </Label>
                  <Input
                    id="tenantPhoneLastFour"
                    name="tenantPhoneLastFour"
                    value={formData.tenantPhoneLastFour}
                    onChange={handleInputChange}
                    placeholder="5678"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rental Period</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>From *</Label>
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
                        <SelectValue placeholder="Month" />
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
                        <SelectValue placeholder="Year" />
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
                  <Label>To *</Label>
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
                        <SelectValue placeholder="Month" />
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
                        <SelectValue placeholder="Year" />
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
              <h3 className="text-lg font-semibold">Review Details</h3>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (Optional)</Label>
                <Select
                  value={formData.rating}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, rating: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} star{rating > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewText">Review *</Label>
                <Textarea
                  id="reviewText"
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleInputChange}
                  placeholder="Describe your experience interacting with this tenant. Include details about their behavior, payment history, property care, and overall reliability."
                  rows={6}
                  maxLength={5000}
                  required
                />
                <div className="text-sm text-gray-500 text-right">
                  {formData.reviewText.length}/5000 characters
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
