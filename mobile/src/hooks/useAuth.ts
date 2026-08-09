import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";

import { loginSuccess, logout } from "../redux/authSlice";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  requestRefreshToken,
} from "../api/axios";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      const parsedUser = storedUser ? (JSON.parse(storedUser) as User) : null;

      if (storedRefreshToken) {
        try {
          const response = await requestRefreshToken(storedRefreshToken);
          const accessToken = response.accessToken ?? response.token;
          const refreshToken = response.refreshToken ?? storedRefreshToken;
          const user = response.user ?? parsedUser;

          if (!accessToken || !user) {
            throw new Error("Invalid refresh response");
          }

          await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

          dispatch(
            loginSuccess({
              token: accessToken,
              refreshToken,
              user,
            })
          );
          setToken(accessToken);
        } catch {
          await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_KEY);
          dispatch(logout());
        } finally {
          setLoading(false);
        }

        return;
      }

      if (storedAccessToken && parsedUser) {
        dispatch(
          loginSuccess({
            token: storedAccessToken,
            refreshToken: null,
            user: parsedUser,
          })
        );
        setToken(storedAccessToken);
      } else {
        dispatch(logout());
      }

      setLoading(false);
    };

    checkAuth();
  }, [dispatch]);

  return {
    loading,
    token,
  };
}
