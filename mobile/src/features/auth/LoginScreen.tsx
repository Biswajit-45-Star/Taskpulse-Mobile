import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import { COLORS } from "../../constants/colors";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { loginUser } from "../../api/auth.api";
import { loginSuccess } from "../../redux/authSlice";

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

type FormData = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const response = await loginUser(data);

      await AsyncStorage.setItem("auth", JSON.stringify(response));

      dispatch(loginSuccess(response));

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>TaskPulse</Text>

        <Text style={styles.subtitle}>Welcome Back 👋</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="Email"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <AppButton
          title="Login"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />

        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.footerText}>Don't have an account?</Text>

          <Text style={styles.link}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 40,
    marginTop: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  footerText: {
    color: COLORS.gray,
  },

  link: {
    color: COLORS.primary,
    fontWeight: "700",
    marginLeft: 6,
  },
});
