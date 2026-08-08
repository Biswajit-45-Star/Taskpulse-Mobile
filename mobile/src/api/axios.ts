import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "https://taskpulse-mobile.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  try {
    let token = await AsyncStorage.getItem("token");

    if (!token) {
      const raw = await AsyncStorage.getItem("auth");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          token = parsed?.token || null;
        } catch (e) {
          token = null;
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore storage errors and continue without auth header
  }

  return config;
});

export default api;