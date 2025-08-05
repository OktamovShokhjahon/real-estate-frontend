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
      title: "Расширенный поиск",
      description:
        "Найдите недвижимость по городу, улице, зданию или количеству комнат. Ищите арендаторов по имени и контактным данным.",
      color: "text-primary bg-primary/10",
    },
    {
      icon: Shield,
      title: "Безопасность и модерация",
      description:
        "Все отзывы модерируются для обеспечения качества и подлинности. Включена фильтрация ненормативной лексики и защита от спама.",
      color: "text-green-600 dark:text-green-400 bg-green-500/10",
    },
    {
      icon: Star,
      title: "Система рейтингов",
      description:
        "Оценивайте свой опыт от 1 до 5 звезд, чтобы помочь другим принимать обоснованные решения о недвижимости и арендаторах.",
      color: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
    },
    {
      icon: Users,
      title: "Сообщество",
      description:
        "Присоединяйтесь к сообществу арендодателей и арендаторов, делящихся честным опытом для построения доверия на рынке аренды.",
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    },
    {
      icon: Clock,
      title: "История аренды",
      description:
        "Отслеживайте периоды аренды и создавайте комплексную историю опыта с недвижимостью и арендаторами с течением времени.",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      icon: MessageSquare,
      title: "Обсуждения и комментарии",
      description:
        "Взаимодействуйте с сообществом через комментарии и обсуждения отзывов для получения более детальной информации.",
      color: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
    },
  ];

  return (
    <section className="py-12 lg:py-16 px-4">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Почему выбирают ProKvartiru.kz?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Наша платформа предоставляет комплексные инструменты для принятия
          обоснованных решений о арендной недвижимости и арендаторах
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
