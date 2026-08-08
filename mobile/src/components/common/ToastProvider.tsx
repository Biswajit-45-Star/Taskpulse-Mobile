import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { COLORS } from "../../constants/colors";

export type ToastType = "success" | "error" | "info";

export type ToastOptions = {
  type?: ToastType;
  title: string;
  message: string;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const getToastColors = (type: ToastType) => {
  switch (type) {
    case "success":
      return { background: "#ECFDF5", border: "#10B981", text: "#065F46" };
    case "error":
      return { background: "#FEF2F2", border: "#EF4444", text: "#991B1B" };
    default:
      return { background: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8" };
  }
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const animation = useMemo(() => new Animated.Value(0), []);

  const showToast = (options: ToastOptions) => {
    setToast({ type: options.type || "info", ...options });
    setVisible(true);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        setToast(null);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible, animation]);

  const value = useMemo(
    () => ({ showToast }),
    []
  );

  const toastColors = toast ? getToastColors(toast.type || "info") : getToastColors("info");

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible && toast ? (
        <View pointerEvents="box-none" style={styles.container}>
          <Animated.View
            style={[
              styles.toast,
              {
                backgroundColor: toastColors.background,
                borderColor: toastColors.border,
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.toastHeader}>
              <Text style={[styles.toastTitle, { color: toastColors.text }]}>
                {toast.title}
              </Text>
            </View>
            <Text style={[styles.toastMessage, { color: toastColors.text }]}> 
              {toast.message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: "center",
    zIndex: 1000,
  },
  toast: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  toastHeader: {
    marginBottom: 6,
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  toastMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});
