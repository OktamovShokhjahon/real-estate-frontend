import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    // "https://prokvartiru.kz/api",
    "http://localhost:4100/api",
  // "https://real-estate-backend-b0go.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Address API functions
export const addressApi = {
  // Get remembered addresses by city
  getRememberedAddresses: async (city?: string, limit = 10) => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    params.append("limit", limit.toString());

    const response = await api.get(`/addresses/remembered?${params}`);
    return response.data;
  },

  // Save a new remembered address
  saveRememberedAddress: async (addressData: {
    city: string;
    street: string;
    building: string;
    residentialComplex?: string;
  }) => {
    const response = await api.post("/addresses/remembered", addressData);
    return response.data;
  },

  // Get popular addresses
  getPopularAddresses: async (limit = 20) => {
    const response = await api.get(`/addresses/popular?limit=${limit}`);
    return response.data;
  },

  // Search addresses
  searchAddresses: async (query: string, limit = 10) => {
    const response = await api.get(
      `/addresses/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data;
  },
};

// Recommendation API functions
export const recommendationApi = {
  getTrendingTopics: async () => {
    const response = await api.get("/recommendations/trending-topics");
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/recommendations/stats");
    return response.data;
  },

  getUserPreferences: async () => {
    const response = await api.get("/recommendations/user-preferences");
    return response.data;
  },
};
