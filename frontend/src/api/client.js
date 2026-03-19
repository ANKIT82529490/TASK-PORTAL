import axios from "axios";


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});


apiClient.interceptors.request.use(
  (config) => {
  
    const storedToken = localStorage.getItem("token");

  
    if (storedToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${storedToken}`;
    }

    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

export default apiClient;