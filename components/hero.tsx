import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Star, Shield } from "lucide-react";

export function Hero() {
  return (
    <div className="text-center space-y-8 px-4">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground leading-tight">
          ProKvartiru.kz
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Отзывы о недвижимости и арендаторах в Казахстане. Делитесь своим
          опытом и принимайте обоснованные решения. Присоединяйтесь к нашему
          сообществу честных рецензентов.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link href="/property">
            <Search className="h-5 w-5 mr-2" />
            Поиск недвижимости
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          asChild
          className="w-full sm:w-auto bg-transparent"
        >
          <Link href="/tenant">
            <Star className="h-5 w-5 mr-2" />
            Поиск арендаторов
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16">
        <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Простой поиск
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Найдите отзывы по местоположению, данным арендатора или особенностям
            недвижимости
          </p>
        </div>

        <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300">
          <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Честные отзывы
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Реальный опыт от проверенных пользователей, чтобы помочь вам
            принимать лучшие решения
          </p>
        </div>

        <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300">
          <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Безопасная платформа
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Модерируемый контент и безопасная обработка данных для вашего
            спокойствия
          </p>
        </div>
      </div>
    </div>
  );
}
