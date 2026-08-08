import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

import { loginSuccess, logout } from "../redux/authSlice";

type AuthStorage = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const savedAuth = await AsyncStorage.getItem("auth");

      if (savedAuth) {
        try {
          const auth: AuthStorage = JSON.parse(savedAuth);

          if (auth?.token) {
            setToken(auth.token);
            dispatch(loginSuccess(auth));
          }
        } catch {
          await AsyncStorage.removeItem("auth");
          dispatch(logout());
        }
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