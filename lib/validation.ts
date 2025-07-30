// Frontend validation utilities with regex patterns

// Cyrillic Unicode range for all blocks
const cyrillic = "\\u0400-\\u04FF\\u0500-\\u052F\\u2DE0-\\u2DFF\\uA640-\\uA69F";

export const validationPatterns = {
  // Email validation (RFC 5322 compliant)
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

  // Password validation (8+ chars, at least 1 uppercase, 1 lowercase, 1 number)
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,

  // Name validation (letters, spaces, hyphens, apostrophes, supports full Cyrillic)
  name: new RegExp(`^[a-zA-Z${cyrillic}\\s\\-']{2,50}$`),

  // City name validation (letters, spaces, hyphens, periods, supports full Cyrillic)
  city: new RegExp(`^[a-zA-Z${cyrillic}\\s\\-.]{2,100}$`),

  // Street name validation (letters, numbers, spaces, common punctuation, supports full Cyrillic)
  street: new RegExp(`^[a-zA-Z${cyrillic}0-9\\s\\-.,']{2,200}$`),

  // Building number/name validation (alphanumeric with common symbols, supports full Cyrillic)
  building: new RegExp(`^[a-zA-Z${cyrillic}0-9\\s\\-.,'/]{1,50}$`),

  // Apartment number validation (alphanumeric with hyphens)
  apartmentNumber: /^[a-zA-Z0-9-]{1,20}$/,

  // Floor number validation (positive integers, basement levels)
  floor: /^-?[0-9]{1,3}$/,

  // Phone number validation (international format)
  phone: /^[+]?[1-9][\d]{0,15}$/,

  // Phone last 4 digits
  phoneLastFour: /^[0-9]{4}$/,

  // ID last 4 digits
  idLastFour: /^[0-9]{4}$/,

  // Landlord name validation (similar to name but more flexible, supports full Cyrillic)
  landlordName: new RegExp(`^[a-zA-Z${cyrillic}\\s\\-.']{2,100}$`),

  // Review text validation (letters, numbers, spaces, punctuation)
  reviewText: /^[\w\s.,!?;:\-'"$$$$[\]/&%$#@+=*]{10,5000}$/,

  // Rating validation (1-5)
  rating: /^[1-5]$/,

  // Year validation (1900-current year + 1)
  year: new RegExp(`^(19[0-9]{2}|20[0-9]{2}|${new Date().getFullYear() + 1})$`),

  // Month validation (1-12)
  month: /^(1[0-2]|[1-9])$/,

  // Number of rooms validation (1-8)
  numberOfRooms: /^[1-8]$/,

  // Search query validation (prevent injection)
  searchQuery: /^[a-zA-Z0-9\s\-.']{1,100}$/,

  // Comment text validation
  commentText: /^[\w\s.,!?;:\-'"$$$$[\]/&%$#@+=*]{1,1000}$/,

  // Tenant full name (more restrictive than general name, supports full Cyrillic)
  tenantFullName: new RegExp(`^[a-zA-Z${cyrillic}\\s\\-'.]{2,100}$`),

  // URL validation
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,

  // Username validation (alphanumeric, underscore, hyphen)
  username: /^[a-zA-Z0-9_-]{3,30}$/,

  // Postal code validation (flexible international format)
  postalCode: /^[a-zA-Z0-9\s-]{3,10}$/,

  // Hexadecimal color validation
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
};

// Validation functions
export const validators = {
  isValidEmail: (email: string): boolean =>
    validationPatterns.email.test(email),
  isValidPassword: (password: string): boolean =>
    validationPatterns.password.test(password),
  isValidName: (name: string): boolean => validationPatterns.name.test(name),
  isValidCity: (city: string): boolean => validationPatterns.city.test(city),
  isValidStreet: (street: string): boolean =>
    validationPatterns.street.test(street),
  isValidBuilding: (building: string): boolean =>
    validationPatterns.building.test(building),
  isValidApartmentNumber: (apt: string): boolean =>
    validationPatterns.apartmentNumber.test(apt),
  isValidFloor: (floor: string | number): boolean =>
    validationPatterns.floor.test(floor.toString()),
  isValidPhone: (phone: string): boolean =>
    validationPatterns.phone.test(phone),
  isValidPhoneLastFour: (phone: string): boolean =>
    validationPatterns.phoneLastFour.test(phone),
  isValidIdLastFour: (id: string): boolean =>
    validationPatterns.idLastFour.test(id),
  isValidLandlordName: (name: string): boolean =>
    validationPatterns.landlordName.test(name),
  isValidReviewText: (text: string): boolean =>
    validationPatterns.reviewText.test(text),
  isValidRating: (rating: string | number): boolean =>
    validationPatterns.rating.test(rating.toString()),
  isValidYear: (year: string | number): boolean =>
    validationPatterns.year.test(year.toString()),
  isValidMonth: (month: string | number): boolean =>
    validationPatterns.month.test(month.toString()),
  isValidNumberOfRooms: (rooms: string | number): boolean =>
    validationPatterns.numberOfRooms.test(rooms.toString()),
  isValidUrl: (url: string): boolean => validationPatterns.url.test(url),
  isValidUsername: (username: string): boolean =>
    validationPatterns.username.test(username),
  isValidPostalCode: (code: string): boolean =>
    validationPatterns.postalCode.test(code),
  isValidHexColor: (color: string): boolean =>
    validationPatterns.hexColor.test(color),
  isValidTenantFullName: (name: string): boolean =>
    validationPatterns.tenantFullName.test(name),
  isValidSearchQuery: (query: string): boolean =>
    validationPatterns.searchQuery.test(query),
  isValidCommentText: (text: string): boolean =>
    validationPatterns.commentText.test(text),
};

// Sanitization functions
export const sanitizers = {
  sanitizeString: (str: string): string => {
    if (typeof str !== "string") return "";
    return str.trim().replace(/[<>]/g, "").substring(0, 1000);
  },

  sanitizeName: (name: string): string => {
    if (typeof name !== "string") return "";
    return name
      .trim()
      .replace(/[^a-zA-Z\s\-'.]/g, "")
      .substring(0, 50);
  },

  sanitizeEmail: (email: string): string => {
    if (typeof email !== "string") return "";
    return email.trim().toLowerCase().substring(0, 254);
  },

  sanitizeCity: (city: string): string => {
    if (typeof city !== "string") return "";
    return city
      .trim()
      .replace(/[^a-zA-Z\s\-.]/g, "")
      .substring(0, 100);
  },

  sanitizeStreet: (street: string): string => {
    if (typeof street !== "string") return "";
    return street
      .trim()
      .replace(/[^a-zA-Z0-9\s\-.,']/g, "")
      .substring(0, 200);
  },

  sanitizeBuilding: (building: string): string => {
    if (typeof building !== "string") return "";
    return building
      .trim()
      .replace(/[^a-zA-Z0-9\s\-.,'/]/g, "")
      .substring(0, 50);
  },

  sanitizeReviewText: (text: string): string => {
    if (typeof text !== "string") return "";
    return text.trim().substring(0, 5000);
  },

  sanitizeSearchQuery: (query: string): string => {
    if (typeof query !== "string") return "";
    return query
      .trim()
      .replace(/[^a-zA-Z0-9\s\-.']/g, "")
      .substring(0, 100);
  },

  sanitizeNumber: (
    num: string | number,
    min = 0,
    max: number = Number.MAX_SAFE_INTEGER
  ): number => {
    const parsed = Number.parseInt(num.toString());
    if (isNaN(parsed)) return min;
    return Math.max(min, Math.min(max, parsed));
  },

  sanitizeFloat: (
    num: string | number,
    min = 0,
    max: number = Number.MAX_SAFE_INTEGER
  ): number => {
    const parsed = Number.parseFloat(num.toString());
    if (isNaN(parsed)) return min;
    return Math.max(min, Math.min(max, parsed));
  },
};

// Validation error messages
export const validationMessages = {
  email: {
    required: "Email обязателен",
    invalid: "Пожалуйста, введите корректный email адрес",
  },
  password: {
    required: "Пароль обязателен",
    invalid:
      "Пароль должен содержать минимум 8 символов с заглавными буквами, строчными буквами и цифрами",
    minLength: "Пароль должен содержать минимум 8 символов",
  },
  name: {
    required: "Имя обязательно",
    invalid: "Имя может содержать только буквы, пробелы, дефисы и апострофы",
    minLength: "Имя должно содержать минимум 2 символа",
    maxLength: "Имя не должно превышать 50 символов",
  },
  city: {
    required: "Город обязателен",
    invalid: "Название города содержит недопустимые символы",
    minLength: "Название города должно содержать минимум 2 символа",
    maxLength: "Название города не должно превышать 100 символов",
  },
  street: {
    required: "Улица обязательна",
    invalid: "Название улицы содержит недопустимые символы",
    minLength: "Название улицы должно содержать минимум 2 символа",
    maxLength: "Название улицы не должно превышать 200 символов",
  },
  building: {
    required: "Здание обязательно",
    invalid: "Название/номер здания содержит недопустимые символы",
    minLength: "Здание должно содержать минимум 1 символ",
    maxLength: "Здание не должно превышать 50 символов",
  },
  apartmentNumber: {
    invalid: "Номер квартиры содержит недопустимые символы",
    maxLength: "Номер квартиры не должен превышать 20 символов",
  },
  floor: {
    invalid: "Этаж должен быть корректным числом",
  },
  phoneLastFour: {
    required: "Последние четыре цифры телефона обязательны",
    invalid: "Последние четыре цифры телефона должны быть ровно 4 цифрами",
  },
  idLastFour: {
    required: "Последние четыре цифры ID обязательны",
    invalid: "Последние четыре цифры ID должны быть ровно 4 цифрами",
  },
  landlordName: {
    required: "Имя арендодателя обязательно",
    invalid: "Имя арендодателя содержит недопустимые символы",
    minLength: "Имя арендодателя должно содержать минимум 2 символа",
    maxLength: "Имя арендодателя не должно превышать 100 символов",
  },
  reviewText: {
    required: "Текст отзыва обязателен",
    invalid: "Текст отзыва содержит недопустимые символы",
    minLength: "Текст отзыва должен содержать минимум 10 символов",
    maxLength: "Текст отзыва не должен превышать 5000 символов",
  },
  rating: {
    invalid: "Рейтинг должен быть от 1 до 5",
  },
  year: {
    required: "Год обязателен",
    invalid: "Пожалуйста, введите корректный год",
  },
  month: {
    required: "Месяц обязателен",
    invalid: "Пожалуйста, выберите корректный месяц",
  },
  numberOfRooms: {
    required: "Количество комнат обязательно",
    invalid: "Количество комнат должно быть от 1 до 8",
  },
  tenantFullName: {
    required: "Полное имя арендатора обязательно",
    invalid: "Полное имя арендатора содержит недопустимые символы",
    minLength: "Полное имя арендатора должно содержать минимум 2 символа",
    maxLength: "Полное имя арендатора не должно превышать 100 символов",
  },
  commentText: {
    required: "Текст комментария обязателен",
    invalid: "Текст комментария содержит недопустимые символы",
    minLength: "Комментарий должен содержать минимум 1 символ",
    maxLength: "Комментарий не должен превышать 1000 символов",
  },
  searchQuery: {
    invalid: "Поисковый запрос содержит недопустимые символы",
    maxLength: "Поисковый запрос не должен превышать 100 символов",
  },
};

// Form validation helper
export const validateField = (
  value: string,
  fieldType: keyof typeof validationMessages,
  required = false
): string | null => {
  const messages = validationMessages[fieldType];

  if (required && (!value || value.trim() === "")) {
    return messages && "required" in messages
      ? messages.required
      : "This field is required";
  }

  if (!value || value.trim() === "") {
    return null; // Optional field, no validation needed
  }

  // Get the appropriate validator
  const validatorName = `isValid${
    fieldType.charAt(0).toUpperCase() + fieldType.slice(1)
  }` as keyof typeof validators;
  const validator = validators[validatorName];

  if (validator && !validator(value)) {
    return messages.invalid || "Invalid format";
  }

  return null;
};

// Form validation for multiple fields
export const validateForm = (
  data: Record<string, any>,
  schema: Record<
    string,
    { type: keyof typeof validationMessages; required?: boolean }
  >
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [fieldName, config] of Object.entries(schema)) {
    const value = data[fieldName];
    const error = validateField(value, config.type, config.required);

    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
};

// Real-time validation hook for React
export const useFieldValidation = (
  value: string,
  fieldType: keyof typeof validationMessages,
  required = false
) => {
  const error = validateField(value, fieldType, required);
  const isValid = error === null;

  return { error, isValid };
};
