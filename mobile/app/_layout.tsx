import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { ToastProvider } from "../src/components/common/ToastProvider";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import useAuth from "../src/hooks/useAuth";

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setAppReady(true);
    }
  }, [loading]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Provider>
  );
}
