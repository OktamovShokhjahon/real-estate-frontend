"use client"

import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, MapPin, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { data: stats } = useQuery("user-dashboard", async () => {
    const response = await api.get("/user/dashboard")
    return response.data
  })

  const { data: reviews } = useQuery("user-reviews", async () => {
    const response = await api.get("/user/my-reviews")
    return response.data
  })

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.firstName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Reviews</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.propertyReviewsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenant Reviews</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tenantReviewsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Add new reviews or browse existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/property/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Property Review
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tenant/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant Review
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/property">
                <MapPin className="h-4 w-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tenant">
                <User className="h-4 w-4 mr-2" />
                Browse Tenants
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Recent Reviews</h2>

        {reviews?.propertyReviews?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Property Reviews</h3>
            <div className="grid gap-4">
              {reviews.propertyReviews.slice(0, 3).map((review: any) => (
                <Card key={review._id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {review.street} {review.building}, {review.city}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Badge variant="secondary" className="mr-2">
                        {review.numberOfRooms} rooms
                      </Badge>
                      <Calendar className="h-4 w-4 mr-1" />
                      {review.rentalPeriod.from.month}/{review.rentalPeriod.from.year} - {review.rentalPeriod.to.month}/
                      {review.rentalPeriod.to.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{review.reviewText}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant={review.isApproved ? "default" : "secondary"}>
                        {review.isApproved ? "Approved" : "Pending Review"}
                      </Badge>
                      <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {reviews?.tenantReviews?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tenant Reviews</h3>
            <div className="grid gap-4">
              {reviews.tenantReviews.slice(0, 3).map((review: any) => (
                <Card key={review._id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      {review.tenantFullName}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {review.rentalPeriod.from.month}/{review.rentalPeriod.from.year} - {review.rentalPeriod.to.month}/
                      {review.rentalPeriod.to.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{review.reviewText}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant={review.isApproved ? "default" : "secondary"}>
                        {review.isApproved ? "Approved" : "Pending Review"}
                      </Badge>
                      <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!reviews?.propertyReviews?.length && !reviews?.tenantReviews?.length && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't written any reviews yet</p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/property/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property Review
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tenant/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tenant Review
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
