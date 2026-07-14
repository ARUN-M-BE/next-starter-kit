import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage =
      error.response?.data?.error || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
