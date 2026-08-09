import React, { useState } from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../src/constants/colors";

export default function SupportPage() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportItems = [
    {
      id: "1",
      title: "Getting Started",
      description: "Learn how to navigate and use Task Pulse effectively",
      icon: "rocket-outline",
      color: "#8B5CF6",
    },
    {
      id: "2",
      title: "Managing Tasks",
      description: "Create, edit, and organize your tasks efficiently",
      icon: "checkbox-outline",
      color: "#10B981",
    },
    {
      id: "3",
      title: "Profile Settings",
      description: "Update your personal information and preferences",
      icon: "person-outline",
      color: "#3B82F6",
    },
    {
      id: "4",
      title: "Notifications",
      description: "Stay updated with task reminders and app alerts",
      icon: "notifications-outline",
      color: "#F59E0B",
    },
  ];

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@taskpulse.app?subject=Task%20Pulse%20Support');
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert("Feedback Required", "Please enter your feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        "Thank You! 🎉",
        "Your feedback has been submitted successfully. We appreciate your input!"
      );
      setFeedback("");
      setIsSubmitting(false);
    }, 1500);
  };

  const handleFAQPress = (title: string) => {
    Alert.alert(
      title,
      "This feature is coming soon! We're working on detailed guides for each section.",
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.subtitle}>
              We're here to help you get the most out of Task Pulse
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={handleEmailSupport}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Email</Text>
              <Text style={styles.quickActionSub}>Support</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => Alert.alert("Coming Soon", "Live chat support will be available soon!")}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#D1FAE5" }]}>
                <Ionicons name="chatbubble-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.quickActionLabel}>Live</Text>
              <Text style={styles.quickActionSub}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => Alert.alert("Coming Soon", "Knowledge base will be available soon!")}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="book-outline" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionLabel}>Knowledge</Text>
              <Text style={styles.quickActionSub}>Base</Text>
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Frequently Asked</Text>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.primary} />
            </View>

            {supportItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.faqCard}
                onPress={() => handleFAQPress(item.title)}
                activeOpacity={0.7}
              >
                <View style={styles.faqContent}>
                  <View style={[styles.faqIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <View style={styles.faqTextContainer}>
                    <Text style={styles.faqTitle}>{item.title}</Text>
                    <Text style={styles.faqDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Info */}
          <View style={styles.contactContainer}>
            <View style={styles.contactDivider} />
            <View style={styles.contactInfo}>
              <Ionicons name="mail-outline" size={16} color="#9CA3AF" />
              <Text style={styles.contactText}>support@taskpulse.app</Text>
            </View>
            <View style={styles.contactInfo}>
              <Ionicons name="time-outline" size={16} color="#9CA3AF" />
              <Text style={styles.contactText}>Response within 24 hours</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || "#F9FAFB",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text || "#111827",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 28,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickAction: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text || "#111827",
  },
  quickActionSub: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text || "#111827",
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  faqContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  faqIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  faqTextContainer: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text || "#111827",
    marginBottom: 2,
  },
  faqDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  feedbackSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  feedbackHeader: {
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text || "#111827",
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  feedbackInputContainer: {
    gap: 12,
  },
  feedbackInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text || "#111827",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.primary || "#4F46E5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  contactContainer: {
    marginTop: 4,
    gap: 8,
  },
  contactDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
});