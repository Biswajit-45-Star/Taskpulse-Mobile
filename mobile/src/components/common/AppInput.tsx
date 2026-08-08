import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
} from "react-native";

import { COLORS } from "../../constants/colors";

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const AppInput = ({ label, error, ...props }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor={COLORS.gray}
        style={[
          styles.input,
          error ? styles.errorBorder : null,
        ]}
        {...props}
      />

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

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: COLORS.text,
    fontSize: 16,
    backgroundColor: COLORS.white,
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