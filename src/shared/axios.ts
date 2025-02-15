import { notification } from "antd";
import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:8080",
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      setTimeout(() => {
        notification.error({
          message: "Request Failed",
          description: error.response.data || "An error occurred",
          duration: 5,
        });
      }, 0);
    }
    return Promise.reject(error);
  }
);
