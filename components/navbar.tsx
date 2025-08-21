"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  User,
  LogOut,
  Settings,
  Home,
  Menu,
  AlertCircle,
  X,
  Heart,
} from "lucide-react";
import { useState } from "react";
import LogoLight from "@/public/prokvartiru-light.png";
import LogoDark from "@/public/prokvartiure-dark.png";
import Image from "next/image";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailReminder, setShowEmailReminder] = useState(true);

  const NavLinks = () => (
    <>
      <Link
        href="/search"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Поиск отзывов
      </Link>
      <Link
        href="/property"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Отзывы о недвижимости
      </Link>
      <Link
        href="/tenant"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Отзывы об арендаторах
      </Link>
      {user && (
        <>
          <Link
            href="/recommendations"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            onClick={() => setIsOpen(false)}
          >
            <Heart className="h-4 w-4" />
            <span>Рекомендации</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Панель управления
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      {user && !user.emailVerified && showEmailReminder && (
        <div className="bg-yellow-50 border-b border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  Пожалуйста, подтвердите свой email для полного доступа к
                  функциям сайта.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100"
                >
                  <Link
                    href={`/verify-email/verify?email=${encodeURIComponent(
                      user.email
                    )}`}
                  >
                    Отправить код повторно
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailReminder(false)}
                  className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              {/* Show LogoDark on light mode, LogoLight on dark mode */}
              <span className="block dark:hidden">
                <Image src={LogoDark} alt="logo" width={200} />
              </span>
              <span className="hidden dark:block">
                <Image src={LogoLight} alt="logo" width={200} />
              </span>
              {/* <img src={Logo} alt="logo" /> */}
              {/* <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ReviewHub</span> */}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks />
            </div>

            {/* Desktop Auth & Theme */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>{user.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/recommendations"
                        className="flex items-center"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Рекомендации
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Панель управления
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Админ-панель
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Войти</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Регистрация</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/recommendations"
                        className="flex items-center"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Рекомендации
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Панель управления
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Админ-панель
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* <NavLinks /> */}
                    <Link
                      href="/property"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Поиск недвижимости
                    </Link>

                    <Link
                      href="/tenant"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Поиск арендаторов
                    </Link>
                    <Link
                      href="/property"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Отзывы о недвижимости
                    </Link>
                    <Link
                      href="/tenant"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Отзывы об арендаторах
                    </Link>
                    {!user && (
                      <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                        <Button
                          variant="ghost"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/login">Войти</Link>
                        </Button>
                        <Button asChild onClick={() => setIsOpen(false)}>
                          <Link href="/register">Регистрация</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
