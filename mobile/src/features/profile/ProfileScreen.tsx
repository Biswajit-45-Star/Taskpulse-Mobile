import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { logout, loginSuccess } from "../../redux/authSlice";
import { RootState } from "../../redux/store";
import AppButton from "../../components/common/AppButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "../../components/common/ToastProvider";
import ProfileFormModal from "../../components/common/ProfileFormModal";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const openEditProfile = () => {
    setSelectedProfile(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedProfile(null);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    dispatch(logout());
    showToast({
      type: "success",
      title: "Logged out",
      message: "You have been logged out successfully.",
    });
    router.replace("/(auth)/login");
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>

      <ProfileFormModal
        visible={isFormOpen}
        defaultValues={{ name: user?.name || "", email: user?.email || "" }}
        onClose={closeForm}
        loading={false}
        onSubmit={async (values) => {
          try {
            const { updateProfile } = await import("../../api/user.api");
            const updated = await updateProfile(values);

            // update secure store
            await SecureStore.setItemAsync("user", JSON.stringify(updated));

            // preserve tokens from redux
            const state = (await import("../../redux/store")).store.getState();
            const token = state.auth.token;
            const refreshToken = state.auth.refreshToken;

            if (!token) {
              throw new Error("Missing auth token while updating profile");
            }

            dispatch(
              loginSuccess({ token, refreshToken: refreshToken ?? undefined, user: updated })
            );

            showToast({ type: "success", title: "Profile updated", message: "Your profile was updated." });
          } catch (e: any) {
            console.error(e);
            showToast({ type: "error", title: "Update failed", message: e.response?.data?.message || "Unable to update profile" });
          }

          closeForm();
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={openEditProfile} style={styles.editButton}>
            <Ionicons name="create-outline" size={22} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(user?.name || "")}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || "Guest"}</Text>
          <Text style={styles.userEmail}>{user?.email || "Not logged in"}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            onPress={() => Alert.alert("This Feature is Comming Soon")}
            style={styles.menuItem}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="person-outline" size={22} color="#4F46E5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Personal Information</Text>
              <Text style={styles.menuSubtitle}>Edit your profile details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("This Feature is Comming Soon")}
            style={styles.menuItem}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="settings-outline" size={22} color="#4F46E5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>App preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#4F46E5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Help & Support</Text>
              <Text style={styles.menuSubtitle}>FAQs and contact</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <AppButton
            title="Logout"
            onPress={handleLogout}
            // style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  editButton: {
    width: 40,
    height: 40,
    // borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    // borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    // borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    // borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4F46E5",
    textTransform: "capitalize",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    // borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    // borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 1,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
  },
});
