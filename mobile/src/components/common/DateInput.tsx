import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

interface DateInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export const parseDate = (value: string) => {
  if (!value) {
    return null;
  }

  const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}(?:T.*)?$/);
  if (isoMatch) {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const dmYMatch = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dmYMatch) {
    const [, day, month, year] = dmYMatch;
    const parsed = new Date(`${year}-${month}-${day}`);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const buildCalendar = (month: number, year: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<number | null> = [];

  for (let i = 0; i < firstDay; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const DateInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  ...props
}: DateInputProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const parsed = parseDate(value);
    if (parsed) {
      setSelectedDate(parsed);
      setCurrentDate(parsed);
    }
  }, [value]);

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    return buildCalendar(currentDate.getMonth(), currentDate.getFullYear());
  }, [currentDate]);

  const handleDayPress = (day: number) => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    setSelectedDate(nextDate);
    onChangeText(formatDate(nextDate));
    setIsPickerOpen(false);
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const month = prev.getMonth() - 1;
      return new Date(prev.getFullYear(), month, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const month = prev.getMonth() + 1;
      return new Date(prev.getFullYear(), month, 1);
    });
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onChangeText(formatDate(today));
    setIsPickerOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChangeText("");
    setIsPickerOpen(false);
  };

  const displayValue = useMemo(() => {
    const parsed = parseDate(value);
    return parsed ? formatDate(parsed) : value;
  }, [value]);

  const hasValue = !!displayValue;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>

      <TouchableOpacity
        style={[
          styles.inputWrapper,
          error && styles.inputWrapperError,
          hasValue && styles.inputWrapperFilled,
        ]}
        activeOpacity={0.7}
        onPress={() => setIsPickerOpen(true)}
      >
        <View style={styles.inputContent}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={hasValue ? "calendar" : "calendar-outline"} 
              size={20} 
              color={hasValue ? COLORS.primary : COLORS.gray} 
            />
          </View>
          <Text
            style={[
              styles.inputText,
              !displayValue && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {displayValue || placeholder || "Select a date"}
          </Text>
          {hasValue && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={COLORS.gray} 
          style={styles.chevronIcon}
        />
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        visible={isPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPickerOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPickerOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Date</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsPickerOpen(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={22} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                {/* Month Navigator */}
                <View style={styles.navigatorContainer}>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={handlePreviousMonth}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={22} color={COLORS.text} />
                  </TouchableOpacity>

                  <Text style={styles.monthLabel}>{monthLabel}</Text>

                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={handleNextMonth}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-forward" size={22} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                {/* Week Days */}
                <View style={styles.weekRow}>
                  {WEEK_DAYS.map((day) => (
                    <Text key={day} style={styles.weekDayText}>
                      {day}
                    </Text>
                  ))}
                </View>

                {/* Calendar Grid */}
                <View style={styles.daysGrid}>
                  {calendarDays.map((day, index) => {
                    const isSelected =
                      day !== null &&
                      selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === currentDate.getMonth() &&
                      selectedDate?.getFullYear() === currentDate.getFullYear();

                    const isTodayDate = day !== null && (() => {
                      const date = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      );
                      return isToday(date);
                    })();

                    return (
                      <TouchableOpacity
                        key={`${index}-${day ?? "empty"}`}
                        style={[
                          styles.dayCell,
                          isSelected && styles.dayCellSelected,
                          isTodayDate && !isSelected && styles.dayCellToday,
                        ]}
                        onPress={() => day !== null && handleDayPress(day)}
                        activeOpacity={day ? 0.7 : 1}
                        disabled={day === null}
                      >
                        {day !== null && (
                          <Text
                            style={[
                              styles.dayText,
                              isSelected && styles.dayTextSelected,
                              isTodayDate && !isSelected && styles.dayTextToday,
                            ]}
                          >
                            {day}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Footer Actions */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={handleToday}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="today" size={18} color={COLORS.primary} />
                    <Text style={styles.footerButtonText}>Today</Text>
                  </TouchableOpacity>

                  <View style={styles.footerDivider} />

                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={handleClear}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
                    <Text style={[styles.footerButtonText, styles.clearText]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default DateInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: COLORS.text,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  requiredStar: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 54,
    // transition: "all 0.2s",
  },
  inputWrapperFilled: {
    borderColor: COLORS.primary,
    backgroundColor: "#F8FAFF",
  },
  inputWrapperError: {
    borderColor: "#EF4444",
    backgroundColor: "#FFF5F5",
  },
  inputContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  navigatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginBottom: 4,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: "#F8FAFF",
  },
  dayText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dayTextToday: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  modalFooter: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    justifyContent: "space-around",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  footerDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  clearText: {
    color: "#EF4444",
  },
});