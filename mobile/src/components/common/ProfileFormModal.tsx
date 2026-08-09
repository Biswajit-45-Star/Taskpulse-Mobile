import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AppInput from "./AppInput";
import AppButton from "./AppButton";
import { COLORS } from "@/src/constants/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string }) => void;
  defaultValues: { name: string; email: string };
  loading?: boolean;
};

export default function ProfileFormModal({
  visible,
  onClose,
  onSubmit,
  defaultValues,
  loading,
}: Props) {
  const { control, handleSubmit } = useForm({ defaultValues });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Profile</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <AppInput label="Name" value={value} onChangeText={onChange} />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AppInput label="Email" value={value} onChangeText={onChange} />
            )}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <AppButton
              style={styles.buttonStyle}
              title="Update"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
            />

            <TouchableOpacity
              style={[styles.footerButton, styles.cancelButtonStyle]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            {/* <AppButton
              style={styles.cancelButtonStyle}
              title="Cancel"
              onPress={onClose}
            /> */}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "white",
    padding: 16,
    // borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  buttonStyle: {
    paddingHorizontal: 20,
  },
  cancelButtonStyle: {
    paddingHorizontal: 20,
    backgroundColor: "#F9FAFB",
    color: "#111",
  },
    footerButton: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
   cancelText: {
      color: COLORS.text || "#111827",
      fontWeight: "600",
      fontSize: 15,
    },
});
