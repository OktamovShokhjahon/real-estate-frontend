"use client";

import React, { useState, useEffect } from "react";
import { addressApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";
import Link from "next/link";

interface PopularAddress {
  _id: string;
  city: string;
  street: string;
  building: string;
  residentialComplex?: string;
  usageCount: number;
}

export function PopularAddresses() {
  const [addresses, setAddresses] = useState<PopularAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularAddresses = async () => {
      try {
        const response = await addressApi.getPopularAddresses(6);
        setAddresses(response.addresses || []);
      } catch (error) {
        console.error("Error loading popular addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularAddresses();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Популярные адреса
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  if (addresses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Популярные адреса
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {addresses.map((address) => (
            <Link
              key={address._id}
              href={`/property?city=${encodeURIComponent(
                address.city
              )}&street=${encodeURIComponent(
                address.street
              )}&building=${encodeURIComponent(address.building)}`}
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">
                      {address.street} {address.building}
                    </div>
                    <div className="text-sm text-gray-500">
                      {address.city}
                      {address.residentialComplex && (
                        <span className="ml-1">
                          • {address.residentialComplex}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-500">
                    {address.usageCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
