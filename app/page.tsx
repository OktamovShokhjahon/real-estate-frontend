import { Hero } from "@/components/hero";
import { Features } from "@/components/features.tsx";
import { RecentReviews } from "@/components/recent-reviews.tsx";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <Features />
      <RecentReviews />
    </div>
  );
}
