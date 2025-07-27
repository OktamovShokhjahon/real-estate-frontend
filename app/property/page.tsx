"use client";

import type React from "react";

import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MapPin, Calendar, Star } from "lucide-react";
import Link from "next/link";

interface PropertyReview {
  _id: string;
  city: string;
  street: string;
  building: string;
  numberOfRooms: number;
  rentalPeriod: {
    from: { month: number; year: number };
    to: { month: number; year: number };
  };
  landlordName: string;
  reviewText: string;
  rating?: number;
  author: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export default function PropertyPage() {
  const [searchParams, setSearchParams] = useState({
    city: "",
    street: "",
    building: "",
    rooms: "",
  });

  const { data, isLoading, refetch } = useQuery(
    ["property-reviews", searchParams],
    async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/property/reviews?${params}`);
      return response.data;
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Property Reviews</h1>
        <p className="text-gray-600">
          Search for reviews about apartments, buildings, and neighborhoods
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={searchParams.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  name="street"
                  value={searchParams.street}
                  onChange={handleInputChange}
                  placeholder="Enter street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  name="building"
                  value={searchParams.building}
                  onChange={handleInputChange}
                  placeholder="Building number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rooms">Rooms</Label>
                <Input
                  id="rooms"
                  name="rooms"
                  type="number"
                  min="1"
                  max="8"
                  value={searchParams.rooms}
                  onChange={handleInputChange}
                  placeholder="Number of rooms"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" asChild>
                <Link href="/property/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-6">
          {data?.reviews?.length > 0 ? (
            <>
              <div className="text-sm text-gray-600">
                Found {data.pagination.total} reviews
              </div>

              <div className="grid gap-6">
                {data.reviews.map((review: PropertyReview) => (
                  <Card key={review._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                            {review.street} {review.building}, {review.city}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Badge variant="secondary" className="mr-2">
                              {review.numberOfRooms} rooms
                            </Badge>
                            {review.rating && (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span>{review.rating}/5</span>
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-gray-500">
                          by {review.author.firstName} {review.author.lastName}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Rental period: {review.rentalPeriod.from.month}/
                          {review.rentalPeriod.from.year} -{" "}
                          {review.rentalPeriod.to.month}/
                          {review.rentalPeriod.to.year}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Landlord: {review.landlordName}
                          </p>
                          <p className="text-gray-700">{review.reviewText}</p>
                        </div>

                        <div className="text-xs text-gray-500">
                          Posted on{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No reviews found</p>
              <Button asChild>
                <Link href="/property/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Be the first to add a review
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
