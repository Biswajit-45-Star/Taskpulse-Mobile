import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "./AppInput";
import AppButton from "./AppButton";
import { COLORS } from "../../constants/colors";

export type TaskFormValues = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string;
};

interface TaskFormModalProps {
  visible: boolean;
  title: string;
  initialValues?: Partial<TaskFormValues>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

const PRIORITY_OPTIONS: TaskFormValues["priority"][] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

const STATUS_OPTIONS: TaskFormValues["status"][] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

// Priority color mapping
const PRIORITY_COLORS = {
  LOW: "#10B981",
  MEDIUM: "#F59E0B",
  HIGH: "#EF4444",
};

const STATUS_ICONS = {
  TODO: "time-outline",
  IN_PROGRESS: "sync-outline",
  DONE: "checkmark-circle-outline",
};

const TaskFormModal = ({
  visible,
  title,
  initialValues,
  loading = false,
  onClose,
  onSubmit,
}: TaskFormModalProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskFormValues["priority"]>(
    "MEDIUM"
  );
  const [status, setStatus] = useState<TaskFormValues["status"]>("TODO");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (visible) {
      setTaskTitle(initialValues?.title || "");
      setDescription(initialValues?.description || "");
      setPriority(initialValues?.priority || "MEDIUM");
      setStatus(initialValues?.status || "TODO");
      setDueDate(initialValues?.dueDate || "");
    }
  }, [visible, initialValues]);

  const handleSubmit = () => {
    if (!taskTitle.trim()) {
      return;
    }

    onSubmit({
      title: taskTitle.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate.trim(),
    });
  };

  // Get priority label with emoji
  const getPriorityEmoji = (p: string) => {
    switch (p) {
      case "HIGH":
        return "🔴";
      case "MEDIUM":
        return "🟡";
      case "LOW":
        return "🟢";
      default:
        return "";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Header with drag indicator */}
            <View style={styles.header}>
              <View style={styles.dragIndicator} />
              <View style={styles.headerContent}>
                <Text style={styles.heading}>{title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.form}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Title Input */}
              <View style={styles.inputWrapper}>
                <AppInput
                  label="Task Title"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  placeholder="What do you need to do?"
                  autoFocus
                />
              </View>

              {/* Description Input */}
              <View style={styles.inputWrapper}>
                <AppInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add some details..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Priority Selection */}
              <View style={styles.optionGroup}>
                <Text style={styles.optionLabel}>Priority Level</Text>
                <View style={styles.optionList}>
                  {PRIORITY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        styles.priorityButton,
                        priority === option && styles.optionButtonActive,
                        priority === option && {
                          backgroundColor: PRIORITY_COLORS[option],
                          borderColor: PRIORITY_COLORS[option],
                        },
                      ]}
                      onPress={() => setPriority(option)}
                      activeOpacity={0.8}
                    >
                      {/* <Text style={styles.priorityEmoji}>
                        {getPriorityEmoji(option)}
                      </Text> */}
                      <Text
                        style={[
                          styles.optionText,
                          priority === option && styles.optionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status Selection */}
              <View style={styles.optionGroup}>
                <Text style={styles.optionLabel}>Status</Text>
                <View style={styles.optionList}>
                  {STATUS_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        styles.statusButton,
                        status === option && styles.optionButtonActive,
                      ]}
                      onPress={() => setStatus(option)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={STATUS_ICONS[option] as any}
                        size={18}
                        color={status === option ? COLORS.white : COLORS.text}
                        style={styles.statusIcon}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          status === option && styles.optionTextActive,
                        ]}
                      >
                        {option.replace("_", " ")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Due Date Input */}
              <View style={styles.inputWrapper}>
                <AppInput
                  label="Due Date"
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="YYYY-MM-DD"
                  keyboardType="default"
                />
                <TouchableOpacity style={styles.calendarIcon}>
                  <Ionicons name="calendar-outline" size={22} color={COLORS.gray} />
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.footerButton, styles.cancelButton]}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <AppButton
                  title="Save Task"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={!taskTitle.trim() || loading}
                  style={styles.saveButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TaskFormModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: COLORS.background || "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    paddingHorizontal: 20,
    maxHeight: "92%",
  },
  header: {
    marginBottom: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    // borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text || "#111827",
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    // borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    paddingBottom: 8,
  },
  inputWrapper: {
    marginBottom: 16,
    position: "relative",
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionLabel: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text || "#111827",
    letterSpacing: 0.3,
  },
  optionList: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    // borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary || "#4F46E5",
    borderColor: COLORS.primary || "#4F46E5",
    shadowColor: COLORS.primary || "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  priorityButton: {
    flexDirection: "row",
    gap: 4,
  },
  statusButton: {
    flexDirection: "row",
    gap: 6,
  },
  priorityEmoji: {
    fontSize: 16,
  },
  statusIcon: {
    marginRight: 2,
  },
  optionText: {
    color: COLORS.text || "#111827",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  optionTextActive: {
    color: COLORS.white || "#FFFFFF",
  },
  calendarIcon: {
    position: "absolute",
    right: 12,
    bottom: 34,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  footerButton: {
    flex: 1,
    height: 54,
    // borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F9FAFB",
  },
  cancelText: {
    color: COLORS.text || "#111827",
    fontWeight: "600",
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
  },
});