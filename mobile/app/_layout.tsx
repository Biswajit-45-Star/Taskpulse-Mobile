import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { ToastProvider } from "../src/components/common/ToastProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </Provider>
  );
}
