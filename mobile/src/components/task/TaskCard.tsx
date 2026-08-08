import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard = ({
  title,
  description,
  priority,
  status,
  dueDate,
  onEdit,
  onDelete,
}: Props) => {
  // Priority color mapping
  const getPriorityColor = (p: string) => {
    switch (p?.toUpperCase()) {
      case "HIGH":
        return "#EF4444";
      case "MEDIUM":
        return "#F59E0B";
      case "LOW":
        return "#10B981";
      default:
        return COLORS.gray;
    }
  };

  const getPriorityIcon = (p: string) => {
    switch (p?.toUpperCase()) {
      case "HIGH":
        return "arrow-up";
      case "MEDIUM":
        return "remove";
      case "LOW":
        return "arrow-down";
      default:
        return "remove";
    }
  };

  // Status color mapping
  const getStatusColor = (s: string) => {
    switch (s?.toUpperCase()) {
      case "TODO":
        return "#6B7280";
      case "IN_PROGRESS":
        return "#3B82F6";
      case "DONE":
        return "#10B981";
      default:
        return COLORS.gray;
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s?.toUpperCase()) {
      case "TODO":
        return "time-outline";
      case "IN_PROGRESS":
        return "sync-outline";
      case "DONE":
        return "checkmark-circle-outline";
      default:
        return "time-outline";
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Row - Priority & Status */}
      <View style={styles.topRow}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) + '20' }]}>
          <Ionicons 
            name={getPriorityIcon(priority) as any} 
            size={14} 
            color={getPriorityColor(priority)} 
          />
          <Text style={[styles.priorityText, { color: getPriorityColor(priority) }]}>
            {priority}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(status) as any} 
            size={14} 
            color={getStatusColor(status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
            {status?.replace("_", " ")}
          </Text>
        </View>
      </View>

      {/* Task Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Description */}
      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}

      {/* Due Date with Icon */}
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color={COLORS.gray} />
        <Text style={styles.date}>Due: {dueDate || "No date set"}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={onEdit} 
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, styles.editIcon]}>
            <MaterialIcons name="edit" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onDelete} 
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, styles.deleteIcon]}>
            <MaterialIcons name="delete" size={18} color={COLORS.danger} />
          </View>
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    backgroundColor: "#EEF2FF",
  },
  deleteIcon: {
    backgroundColor: "#FEE2E2",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  deleteText: {
    color: "#EF4444",
  },
});