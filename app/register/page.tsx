"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Inline input validation logic ---

// Email regex (RFC 5322 simplified)
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Name: letters (latin/cyrillic), spaces, hyphens, apostrophes, 2-50 chars
const cyrillic = "\\u0400-\\u04FF\\u0500-\\u052F\\u2DE0-\\u2DFF\\uA640-\\uA69F";
const nameRegex = new RegExp(`^[a-zA-Z${cyrillic}\\s\\-']{2,50}$`);

// Sanitizers
const sanitizeEmail = (email: string) => email.trim().toLowerCase();
const sanitizeName = (name: string) => name.trim().replace(/\s+/g, " ");

// Validation function
function validateRegisterForm(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}) {
  const errors: Record<string, string> = {};

  // Email
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email обязателен";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Введите корректный email";
  }

  // Password
  if (!data.password || data.password.trim() === "") {
    errors.password = "Пароль обязателен";
  } else if (!passwordRegex.test(data.password)) {
    errors.password =
      "Пароль должен содержать минимум 8 символов, заглавные и строчные буквы и цифры";
  }

  // First Name
  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "Имя обязательно";
  } else if (!nameRegex.test(data.firstName)) {
    errors.firstName =
      "Имя может содержать только буквы, пробелы, дефисы и апострофы (2-50 символов)";
  }

  // Last Name
  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "Фамилия обязательна";
  } else if (!nameRegex.test(data.lastName)) {
    errors.lastName =
      "Фамилия может содержать только буквы, пробелы, дефисы и апострофы (2-50 символов)";
  }

  // Terms acceptance
  if (!data.acceptTerms) {
    errors.acceptTerms = "Необходимо принять условия использования";
  }

  return errors;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize input data
    const sanitizedData = {
      email: sanitizeEmail(formData.email),
      password: formData.password, // Don't sanitize password
      firstName: sanitizeName(formData.firstName),
      lastName: sanitizeName(formData.lastName),
      acceptTerms: formData.acceptTerms,
    };

    // Validate form
    const validationErrors = validateRegisterForm(sanitizedData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(sanitizedData);
      // If you want to show verification, add the state here
      // setShowVerification(true);
      // setVerificationEmail(sanitizedData.email);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptTerms: checked,
    }));

    if (errors.acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: "",
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>
            Создайте аккаунт, чтобы начать оставлять отзывы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500">
                Пароль должен содержать минимум 8 символов с заглавными буквами,
                строчными буквами и цифрами
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={handleCheckboxChange}
                />
                <div className="flex items-center space-x-1">
                  <Label htmlFor="acceptTerms" className="text-sm">
                    Я принимаю{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          условия использования
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Публичная оферта об использовании сайта с отзывами о
                            жилых комплексах и квартирах
                          </DialogTitle>
                          <DialogDescription>
                            Настоящий документ является официальным предложением
                            (публичной офертой) в соответствии со статьей 395
                            Гражданского кодекса Республики Казахстан
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm">
                          <p>
                            Пользуясь Сайтом, Вы (далее — «Пользователь»)
                            подтверждаете, что ознакомлены с условиями настоящей
                            оферты и соглашаетесь с ними в полном объеме.
                          </p>

                          <div>
                            <h3 className="font-semibold mb-2">
                              1. Назначение сайта
                            </h3>
                            <p className="mb-2">
                              1.1. Сайт является информационной платформой,
                              предоставляющей Пользователям возможность
                              размещать и читать отзывы, мнения, комментарии,
                              фотографии, а также иную информацию о квартирах,
                              жилых домах и жилых комплексах.
                            </p>
                            <p>
                              1.2. Сайт не является средством массовой
                              информации, агентом, застройщиком, риэлтором или
                              посредником в сделках с недвижимостью.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">
                              2. Ответственность администрации
                            </h3>
                            <p className="mb-2">
                              2.1. Администрация Сайта (далее — «Администрация»)
                              не проверяет достоверность размещаемой
                              Пользователями информации и не несёт
                              ответственности за ее содержание, точность,
                              полноту, достоверность, актуальность, соответствие
                              действительности, а также возможные последствия её
                              использования.
                            </p>
                            <p className="mb-2">
                              2.2. Администрация Сайта не несет ответственности
                              за мнения, оценки и утверждения, размещённые
                              Пользователями в отзывах, комментариях или любом
                              другом контенте.
                            </p>
                            <p>
                              2.3. Администрация Сайта не обязана осуществлять
                              предварительную модерацию или редактуру
                              публикуемой информации, но вправе по своему
                              усмотрению удалять материалы, нарушающие
                              действующее законодательство Республики Казахстан,
                              нормы морали, этики или настоящие условия.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">
                              3. Обязанности пользователей
                            </h3>
                            <p className="mb-2">3.1. Пользователь обязуется:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                не размещать заведомо ложную, клеветническую,
                                оскорбительную или иную незаконную информацию;
                              </li>
                              <li>
                                не нарушать авторские права, права на товарные
                                знаки, конфиденциальную информацию и другие
                                права третьих лиц;
                              </li>
                              <li>
                                соблюдать нормы законодательства Республики
                                Казахстан, включая Закон «О средствах массовой
                                информации», Закон «О защите персональных
                                данных», Гражданский кодекс и иные нормативные
                                правовые акты.
                              </li>
                            </ul>
                            <p className="mt-2">
                              3.2. Пользователь несёт полную ответственность за
                              размещённую им информацию и возможные последствия
                              её публикации.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">
                              4. Использование информации
                            </h3>
                            <p className="mb-2">
                              4.1. Администрация Сайта вправе использовать,
                              сохранять, обрабатывать и распространять
                              пользовательский контент (отзывы, комментарии и
                              иное), размещённый на Сайте, без отдельного
                              согласия автора, при условии соблюдения норм
                              законодательства.
                            </p>
                            <p>
                              4.2. Администрация не гарантирует постоянную
                              доступность Сайта, отсутствие ошибок, сбоев, а
                              также сохранность размещённой информации.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">
                              5. Изменение условий
                            </h3>
                            <p>
                              5.1. Администрация вправе в любое время вносить
                              изменения в настоящую публичную оферту без
                              предварительного уведомления Пользователей. Новая
                              редакция вступает в силу с момента размещения на
                              Сайте.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">
                              6. Заключительные положения
                            </h3>
                            <p className="mb-2">
                              6.1. Настоящая публичная оферта регулируется
                              законодательством Республики Казахстан.
                            </p>
                            <p>
                              6.2. Все споры и разногласия, возникающие в связи
                              с использованием Сайта, подлежат разрешению в
                              порядке, установленном действующим
                              законодательством Республики Казахстан.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Label>
                </div>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
