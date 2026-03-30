import axios from "axios";

// TypeScript types for API responses
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: any;
  token?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshTokenValue = localStorage.getItem("refresh_token");

      if (!refreshTokenValue) {
        // No refresh token, redirect to login
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post<RefreshTokenResponse>(
          "http://127.0.0.1:8000/refresh-token",
          { refresh_token: refreshTokenValue }
        );

        const { access_token, refresh_token } = response.data;

        // Update tokens in localStorage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("authToken", access_token);

        if (refresh_token) {
          localStorage.setItem("refresh_token", refresh_token);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const reviews = () => API.get("/reviews");

// Auth APIs
export const sendOTP = (email: string) =>
  API.post("/send-otp", null, {
    params: { email }
  });

export const verifyOTP = (email: string, otp: string) =>
  API.post<AuthResponse>("/verify-otp", null, {
    params: { email, otp }
  });

export const refreshToken = (refreshToken: string) =>
  API.post<RefreshTokenResponse>("/refresh-token", {
    refresh_token: refreshToken
  });

// Teacher APIs
export const createTeacher = (data: {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  joining_date: string;
}) => API.post("/create-teacher", data);

export interface TeacherResponse {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  joining_date: string;
  status: "Active" | "Inactive";
}

export const getTeachers = () =>
  API.get<TeacherResponse[]>("/teachers");

export default API;