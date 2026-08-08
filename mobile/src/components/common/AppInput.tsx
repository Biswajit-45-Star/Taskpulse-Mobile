import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

const AppInput = ({
  label,
  error,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          error ? styles.errorBorder : null,
        ]}
      >
        <TextInput
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          secureTextEntry={
            showPasswordToggle ? !showPassword : secureTextEntry
          }
          {...props}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        )}
      </View>

      {!!error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: COLORS.text,
    fontSize: 15,
  },

  inputWrapper: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    // borderRadius: 12,
    backgroundColor: COLORS.white,
  },

  input: {
    flex: 1,
    height: 54,
    paddingHorizontal: 15,
    color: COLORS.text,
    fontSize: 16,
  },

  eyeButton: {
    paddingHorizontal: 15,
  },

  errorBorder: {
    borderColor: COLORS.danger,
  },

  error: {
    color: COLORS.danger,
    marginTop: 5,
    fontSize: 13,
  },
});