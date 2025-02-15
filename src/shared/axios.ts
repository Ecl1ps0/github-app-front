import { notification } from "antd";
import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:8080",
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      notification.error({
        message: "Error",
        description: error.response?.data,
        duration: 5,
      });
    }
    return Promise.reject(error);
  }
);
