import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { RecentReviews } from "@/components/recent-reviews";
import { PopularAddresses } from "@/components/popular-addresses";
import { RecommendationNotification } from "@/components/recommendation-notification";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <Features />
      <RecommendationNotification />
      <div className="grid md:grid-cols-2 gap-8">
        <RecentReviews />
        <PopularAddresses />
      </div>
    </div>
  );
}
