import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Create the Axios instance
const AxiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL as string,
  withCredentials: true,
  withXSRFToken: true,
});

// Request interceptor
AxiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
AxiosClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response.config.url !== "api/auth/login" &&
      error.response.config.url !== "/api/last-booking-detail"
    ) {
      // Important: Hooks like useAuthContext() cannot be used here.
      // Handle logout or redirect globally outside interceptors.
      console.warn("Unauthorized access – trigger logout externally.");
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default AxiosClient;






// import axios from "axios";
// import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
// import { useAuthContext } from "../context/AppContext";

// // Create Axios instance
// const AxiosClient: AxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_APP_BASE_URL as string,
//   withCredentials: true,
//   withXSRFToken: true,
// });

// // Request interceptor
// AxiosClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//     const token = localStorage.getItem("ACCESS_TOKEN");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     config.headers.Accept = "application/json";
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// AxiosClient.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => {
//     return response;
//   },
//   (error) => {
//     if (
//       error.response?.status === 401 &&
//       error.response.config.url !== "api/auth/login" &&
//       error.response.config.url !== "/api/last-booking-detail"
//     ) {
//       // Since hooks cannot be used directly here, you must use an auth context outside the interceptor.
//       // You can refactor your logout mechanism to handle 401s globally in your app instead.
//       console.warn("Unauthorized access – please logout manually.");
//     }
//     return Promise.reject(error.response?.data || error);
//   }
// );

// export default AxiosClient;
