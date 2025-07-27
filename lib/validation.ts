// Frontend validation utilities with regex patterns

export const validationPatterns = {
  // Email validation (RFC 5322 compliant)
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

  // Password validation (8+ chars, at least 1 uppercase, 1 lowercase, 1 number)
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,

  // Name validation (letters, spaces, hyphens, apostrophes)
  name: /^[a-zA-Z\s\-']{2,50}$/,

  // City name validation (letters, spaces, hyphens, periods)
  city: /^[a-zA-Z\s\-.]{2,100}$/,

  // Street name validation (letters, numbers, spaces, common punctuation)
  street: /^[a-zA-Z0-9\s\-.,']{2,200}$/,

  // Building number/name validation (alphanumeric with common symbols)
  building: /^[a-zA-Z0-9\s\-.,'/]{1,50}$/,

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

  // Landlord name validation (similar to name but more flexible)
  landlordName: /^[a-zA-Z\s\-.']{2,100}$/,

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

  // Tenant full name (more restrictive than general name)
  tenantFullName: /^[a-zA-Z\s\-'.]{2,100}$/,

  // URL validation
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,

  // Username validation (alphanumeric, underscore, hyphen)
  username: /^[a-zA-Z0-9_-]{3,30}$/,

  // Postal code validation (flexible international format)
  postalCode: /^[a-zA-Z0-9\s-]{3,10}$/,

  // Hexadecimal color validation
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
}

// Validation functions
export const validators = {
  isValidEmail: (email: string): boolean => validationPatterns.email.test(email),
  isValidPassword: (password: string): boolean => validationPatterns.password.test(password),
  isValidName: (name: string): boolean => validationPatterns.name.test(name),
  isValidCity: (city: string): boolean => validationPatterns.city.test(city),
  isValidStreet: (street: string): boolean => validationPatterns.street.test(street),
  isValidBuilding: (building: string): boolean => validationPatterns.building.test(building),
  isValidApartmentNumber: (apt: string): boolean => validationPatterns.apartmentNumber.test(apt),
  isValidFloor: (floor: string | number): boolean => validationPatterns.floor.test(floor.toString()),
  isValidPhone: (phone: string): boolean => validationPatterns.phone.test(phone),
  isValidPhoneLastFour: (phone: string): boolean => validationPatterns.phoneLastFour.test(phone),
  isValidIdLastFour: (id: string): boolean => validationPatterns.idLastFour.test(id),
  isValidLandlordName: (name: string): boolean => validationPatterns.landlordName.test(name),
  isValidReviewText: (text: string): boolean => validationPatterns.reviewText.test(text),
  isValidRating: (rating: string | number): boolean => validationPatterns.rating.test(rating.toString()),
  isValidYear: (year: string | number): boolean => validationPatterns.year.test(year.toString()),
  isValidMonth: (month: string | number): boolean => validationPatterns.month.test(month.toString()),
  isValidNumberOfRooms: (rooms: string | number): boolean => validationPatterns.numberOfRooms.test(rooms.toString()),
  isValidUrl: (url: string): boolean => validationPatterns.url.test(url),
  isValidUsername: (username: string): boolean => validationPatterns.username.test(username),
  isValidPostalCode: (code: string): boolean => validationPatterns.postalCode.test(code),
  isValidHexColor: (color: string): boolean => validationPatterns.hexColor.test(color),
  isValidTenantFullName: (name: string): boolean => validationPatterns.tenantFullName.test(name),
  isValidSearchQuery: (query: string): boolean => validationPatterns.searchQuery.test(query),
  isValidCommentText: (text: string): boolean => validationPatterns.commentText.test(text),
}

// Sanitization functions
export const sanitizers = {
  sanitizeString: (str: string): string => {
    if (typeof str !== "string") return ""
    return str.trim().replace(/[<>]/g, "").substring(0, 1000)
  },

  sanitizeName: (name: string): string => {
    if (typeof name !== "string") return ""
    return name
      .trim()
      .replace(/[^a-zA-Z\s\-'.]/g, "")
      .substring(0, 50)
  },

  sanitizeEmail: (email: string): string => {
    if (typeof email !== "string") return ""
    return email.trim().toLowerCase().substring(0, 254)
  },

  sanitizeCity: (city: string): string => {
    if (typeof city !== "string") return ""
    return city
      .trim()
      .replace(/[^a-zA-Z\s\-.]/g, "")
      .substring(0, 100)
  },

  sanitizeStreet: (street: string): string => {
    if (typeof street !== "string") return ""
    return street
      .trim()
      .replace(/[^a-zA-Z0-9\s\-.,']/g, "")
      .substring(0, 200)
  },

  sanitizeBuilding: (building: string): string => {
    if (typeof building !== "string") return ""
    return building
      .trim()
      .replace(/[^a-zA-Z0-9\s\-.,'/]/g, "")
      .substring(0, 50)
  },

  sanitizeReviewText: (text: string): string => {
    if (typeof text !== "string") return ""
    return text.trim().substring(0, 5000)
  },

  sanitizeSearchQuery: (query: string): string => {
    if (typeof query !== "string") return ""
    return query
      .trim()
      .replace(/[^a-zA-Z0-9\s\-.']/g, "")
      .substring(0, 100)
  },

  sanitizeNumber: (num: string | number, min = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
    const parsed = Number.parseInt(num.toString())
    if (isNaN(parsed)) return min
    return Math.max(min, Math.min(max, parsed))
  },

  sanitizeFloat: (num: string | number, min = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
    const parsed = Number.parseFloat(num.toString())
    if (isNaN(parsed)) return min
    return Math.max(min, Math.min(max, parsed))
  },
}

// Validation error messages
export const validationMessages = {
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    invalid: "Password must be at least 8 characters with uppercase, lowercase, and number",
    minLength: "Password must be at least 8 characters long",
  },
  name: {
    required: "Name is required",
    invalid: "Name can only contain letters, spaces, hyphens, and apostrophes",
    minLength: "Name must be at least 2 characters long",
    maxLength: "Name must be no more than 50 characters long",
  },
  city: {
    required: "City is required",
    invalid: "City name contains invalid characters",
    minLength: "City name must be at least 2 characters long",
    maxLength: "City name must be no more than 100 characters long",
  },
  street: {
    required: "Street is required",
    invalid: "Street name contains invalid characters",
    minLength: "Street name must be at least 2 characters long",
    maxLength: "Street name must be no more than 200 characters long",
  },
  building: {
    required: "Building is required",
    invalid: "Building name/number contains invalid characters",
    minLength: "Building must be at least 1 character long",
    maxLength: "Building must be no more than 50 characters long",
  },
  apartmentNumber: {
    invalid: "Apartment number contains invalid characters",
    maxLength: "Apartment number must be no more than 20 characters long",
  },
  floor: {
    invalid: "Floor must be a valid number",
  },
  phoneLastFour: {
    required: "Phone last four digits are required",
    invalid: "Phone last four digits must be exactly 4 numbers",
  },
  idLastFour: {
    required: "ID last four digits are required",
    invalid: "ID last four digits must be exactly 4 numbers",
  },
  landlordName: {
    required: "Landlord name is required",
    invalid: "Landlord name contains invalid characters",
    minLength: "Landlord name must be at least 2 characters long",
    maxLength: "Landlord name must be no more than 100 characters long",
  },
  reviewText: {
    required: "Review text is required",
    invalid: "Review text contains invalid characters",
    minLength: "Review text must be at least 10 characters long",
    maxLength: "Review text must be no more than 5000 characters long",
  },
  rating: {
    invalid: "Rating must be between 1 and 5",
  },
  year: {
    required: "Year is required",
    invalid: "Please enter a valid year",
  },
  month: {
    required: "Month is required",
    invalid: "Please select a valid month",
  },
  numberOfRooms: {
    required: "Number of rooms is required",
    invalid: "Number of rooms must be between 1 and 8",
  },
  tenantFullName: {
    required: "Tenant full name is required",
    invalid: "Tenant full name contains invalid characters",
    minLength: "Tenant full name must be at least 2 characters long",
    maxLength: "Tenant full name must be no more than 100 characters long",
  },
  commentText: {
    required: "Comment text is required",
    invalid: "Comment text contains invalid characters",
    minLength: "Comment must be at least 1 character long",
    maxLength: "Comment must be no more than 1000 characters long",
  },
  searchQuery: {
    invalid: "Search query contains invalid characters",
    maxLength: "Search query must be no more than 100 characters long",
  },
}

// Form validation helper
export const validateField = (
  value: string,
  fieldType: keyof typeof validationMessages,
  required = false,
): string | null => {
  const messages = validationMessages[fieldType]

  if (required && (!value || value.trim() === "")) {
    return messages.required || "This field is required"
  }

  if (!value || value.trim() === "") {
    return null // Optional field, no validation needed
  }

  // Get the appropriate validator
  const validatorName = `isValid${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}` as keyof typeof validators
  const validator = validators[validatorName]

  if (validator && !validator(value)) {
    return messages.invalid || "Invalid format"
  }

  return null
}

// Form validation for multiple fields
export const validateForm = (
  data: Record<string, any>,
  schema: Record<string, { type: keyof typeof validationMessages; required?: boolean }>,
): Record<string, string> => {
  const errors: Record<string, string> = {}

  for (const [fieldName, config] of Object.entries(schema)) {
    const value = data[fieldName]
    const error = validateField(value, config.type, config.required)

    if (error) {
      errors[fieldName] = error
    }
  }

  return errors
}

// Real-time validation hook for React
export const useFieldValidation = (value: string, fieldType: keyof typeof validationMessages, required = false) => {
  const error = validateField(value, fieldType, required)
  const isValid = error === null

  return { error, isValid }
}
