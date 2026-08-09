import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../src/constants/colors";

const notifications = [
  {
    id: "1",
    title: "Welcome to Task Pulse",
    message: "Your task dashboard is ready. You can filter tasks using the controls in the Home screen.",
    time: "2 min ago",
    read: false,
    type: "welcome",
  },
  {
    id: "2",
    title: "Profile Updated",
    message: "Your profile changes are saved securely and available on your next login.",
    time: "1 hour ago",
    read: true,
    type: "update",
  },
  {
    id: "3",
    title: "Stay productive",
    message: "Open the app daily to complete your tasks and keep your list fresh.",
    time: "2 days ago",
    read: true,
    type: "reminder",
  },
];

const getIconForType = (type: string) => {
  switch (type) {
    case "welcome":
      return "hand-left";
    case "update":
      return "checkmark-circle";
    case "reminder":
      return "alarm";
    default:
      return "notifications";
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case "welcome":
      return "#8B5CF6";
    case "update":
      return "#10B981";
    case "reminder":
      return "#F59E0B";
    default:
      return COLORS.primary;
  }
};

export default function NotificationsPage() {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = filter === "all" 
    ? allNotifications 
    : allNotifications.filter(n => !n.read);

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setAllNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const markAsRead = (id: string) => {
    setAllNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity
      style={[
        styles.card,
        !item.read && styles.cardUnread,
      ]}
      activeOpacity={0.7}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: getColorForType(item.type) + '15' }]}>
          <Ionicons 
            name={getIconForType(item.type) as any} 
            size={22} 
            color={getColorForType(item.type)} 
          />
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.cardText} numberOfLines={2}>
            {item.message}
          </Text>
          <View style={styles.cardFooter}>
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
            activeOpacity={0.7}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, filter === "all" && styles.tabActive]}
          onPress={() => setFilter("all")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, filter === "all" && styles.tabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === "unread" && styles.tabActive]}
          onPress={() => setFilter("unread")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, filter === "unread" && styles.tabTextActive]}>
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="notifications-off-outline" size={56} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>
            {filter === "unread" 
              ? "You've read all your notifications" 
              : "You're all caught up!"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text || "#111827",
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  markAllText: {
    color: COLORS.primary || "#4F46E5",
    fontSize: 13,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary || "#4F46E5",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
  },
  tabBadgeText: {
    color: COLORS.primary || "#4F46E5",
    fontSize: 11,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardUnread: {
    borderColor: COLORS.primary || "#4F46E5",
    borderWidth: 2,
    backgroundColor: "#F8FAFF",
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text || "#111827",
    flex: 1,
  },
  cardTitleUnread: {
    fontWeight: "700",
    color: "#111827",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4F46E5",
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text || "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});