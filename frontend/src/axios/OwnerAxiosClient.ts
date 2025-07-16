import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
  
  // Create typed Axios instance
  const OwnerAxiosClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL as string,
    withCredentials: true,
    withXSRFToken: true,
  });
  
  // Request interceptor
  OwnerAxiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem("ACCESS_OWNER_TOKEN");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers.Accept = "application/json";
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  export default OwnerAxiosClient;
  


// import axios from "axios";

// const OwnerAxiosClient = axios.create({
//     baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,
//     withCredentials: true,
//     withXSRFToken: true
// })

// OwnerAxiosClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem('ACCESS_OWNER_TOKEN')
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     config.headers.Accept = 'application/json'
//     return config
// })

// export default OwnerAxiosClient
