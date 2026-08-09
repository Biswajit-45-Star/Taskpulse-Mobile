import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
// avoid static imports of store/slices to prevent require cycles

const baseURL = "https://taskpulse-mobile.onrender.com/api";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "user";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function clearStoredAuth() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

async function refreshAccessToken(refreshToken: string) {
  const refreshClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await refreshClient.post("/auth/refresh", {
    refreshToken,
  });

  return response.data;
}

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore storage errors and continue without auth header
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      !originalRequest ||
      !error.response ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        await clearStoredAuth();
        const { store } = await import("../redux/store");
        const { logout } = await import("../redux/authSlice");
        store.dispatch(logout());
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await refreshAccessToken(refreshToken);
        const newAccessToken = response.accessToken ?? response.token;
        const newRefreshToken = response.refreshToken ?? refreshToken;

        if (!newAccessToken) {
          throw new Error("Refresh response did not return a new access token.");
        }

        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);

        if (newRefreshToken) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        const { store } = await import("../redux/store");
        const { updateTokens } = await import("../redux/authSlice");

        store.dispatch(
          updateTokens({ token: newAccessToken, refreshToken: newRefreshToken })
        );

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await clearStoredAuth();
        const { store } = await import("../redux/store");
        const { logout } = await import("../redux/authSlice");
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const requestRefreshToken = refreshAccessToken;
export default api;
