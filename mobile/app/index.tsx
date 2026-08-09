import { Redirect } from "expo-router";
import useAuth from "../src/hooks/useAuth";

export default function Index() {
  const { token, loading } = useAuth();

  // Wait for auth restoration before deciding where to redirect
  if (loading) return null;

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}