import {
  Search,
  Shield,
  Star,
  Users,
  Clock,
  MessageSquare,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Find properties by city, street, building, or number of rooms. Search tenants by name and contact details.",
      color: "text-primary bg-primary/10",
    },
    {
      icon: Shield,
      title: "Secure & Moderated",
      description:
        "All reviews are moderated for quality and authenticity. Profanity filtering and spam protection included.",
      color: "text-green-600 dark:text-green-400 bg-green-500/10",
    },
    {
      icon: Star,
      title: "Rating System",
      description:
        "Rate your experiences from 1-5 stars to help others make informed decisions about properties and tenants.",
      color: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join a community of landlords and tenants sharing honest experiences to build trust in the rental market.",
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    },
    {
      icon: Clock,
      title: "Rental History",
      description:
        "Track rental periods and build a comprehensive history of property and tenant experiences over time.",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      icon: MessageSquare,
      title: "Discussion & Comments",
      description:
        "Engage with the community through comments and discussions on reviews to get more detailed insights.",
      color: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
    },
  ];

  return (
    <section className="py-12 lg:py-16 px-4">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Why Choose ReviewHub?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Our platform provides comprehensive tools for making informed
          decisions about rental properties and tenants
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:bg-accent/50 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${feature.color}`}
              >
                <IconComponent className="h-8 w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
