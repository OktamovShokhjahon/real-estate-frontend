"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"

export default function AddPropertyReviewPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
  })

  if (!user) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
      }

      await api.post("/property/reviews", submitData)
      toast.success("Review submitted successfully!")
      router.push("/property")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".")
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
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)
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
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Property Review</CardTitle>
          <CardDescription>Share your experience about a rental property</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Details</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street *</Label>
                  <Input id="street" name="street" value={formData.street} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building">Building *</Label>
                  <Input
                    id="building"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input id="floor" name="floor" type="number" value={formData.floor} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartmentNumber">Apartment Number</Label>
                  <Input
                    id="apartmentNumber"
                    name="apartmentNumber"
                    value={formData.apartmentNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfRooms">Number of Rooms *</Label>
                <Select
                  value={formData.numberOfRooms}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, numberOfRooms: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} room{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rental Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rental Period</h3>

              <div className="grid md:grid-cols-2 gap-6">
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
                <Label htmlFor="landlordName">Landlord Name *</Label>
                <Input
                  id="landlordName"
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (Optional)</Label>
                <Select
                  value={formData.rating}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, rating: value }))}
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
                  placeholder="Describe the apartment, all pros and cons during the rental period, and your experience with the landlord."
                  rows={6}
                  maxLength={5000}
                  required
                />
                <div className="text-sm text-gray-500 text-right">{formData.reviewText.length}/5000 characters</div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
