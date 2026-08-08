import React from "react";
import {
  Platform,
  StyleSheet,
  View,
} from "react-native";

import {
  Tabs,
  Redirect,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import useAuth from "../../src/hooks/useAuth";
import { COLORS } from "../../src/constants/colors";

export default function TabLayout() {
  const { loading, token } = useAuth();

  // -----------------------------------------
  // Auth Loading
  // -----------------------------------------

  if (loading) {
    return null;
  }

  // -----------------------------------------
  // Protect Tabs
  // -----------------------------------------

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  // -----------------------------------------
  // Tabs
  // -----------------------------------------

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true,

        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: COLORS.primary,

        tabBarInactiveTintColor: COLORS.gray,

        tabBarLabelStyle: styles.tabLabel,

        tabBarItemStyle: styles.tabItem,

        tabBarStyle: styles.tabBar,
      }}
    >
      {/* =====================================
          HOME
      ===================================== */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Ionicons
                name={
                  focused
                    ? "home"
                    : "home-outline"
                }
                size={22}
                color={
                  focused
                    ? COLORS.white
                    : COLORS.gray
                }
              />
            </View>
          ),
        }}
      />

      {/* =====================================
          PROFILE
      ===================================== */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Ionicons
                name={
                  focused
                    ? "person"
                    : "person-outline"
                }
                size={22}
                color={
                  focused
                    ? COLORS.white
                    : COLORS.gray
                }
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

// ==================================================
// Styles
// ==================================================

const styles = StyleSheet.create({
  // -----------------------------------------------
  // Tab Bar
  // -----------------------------------------------

  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 18 : 14,
    height: Platform.OS === "ios" ? 72 : 68,
    backgroundColor: COLORS.white,
    // borderRadius: 20,
    borderTopWidth: 0,
    paddingTop: 8,
    paddingBottom:
      Platform.OS === "ios" ? 10 : 8,
    paddingHorizontal: 20,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 10,
    marginHorizontal: 10,
  },

  // -----------------------------------------------
  // Tab Item
  // -----------------------------------------------

  tabItem: {
    paddingVertical: 2,
  },

  // -----------------------------------------------
  // Label
  // -----------------------------------------------

  tabLabel: {
    fontSize: 11,

    fontWeight: "600",

    marginTop: 2,
  },

  // -----------------------------------------------
  // Icon
  // -----------------------------------------------

  iconWrapper: {
    width: 38,
    height: 30,

    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapperActive: {
    backgroundColor: COLORS.primary,

    shadowColor: COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.20,

    shadowRadius: 6,

    elevation: 4,
  },
});