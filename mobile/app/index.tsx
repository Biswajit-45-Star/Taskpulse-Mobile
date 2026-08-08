import { Redirect } from "expo-router";
import useAuth from "../src/hooks/useAuth";

export default function Index() {

  const { token } = useAuth();

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}