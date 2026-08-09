import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { COLORS } from "../../constants/colors";
import TaskCard from "../../components/task/TaskCard";
import ConfirmModal from "../common/ConfirmModal";
import TaskFormModal, { TaskFormValues } from "../common/TaskFormModal";

import { RootState } from "../../redux/store";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useToast } from "../common/ToastProvider";

import {
  fetchTasks,
  addTask,
  editTask,
  removeTask,
} from "../../redux/taskSlice";
import { Task } from "../../api/task.api";

const HomeScreen = () => {
  // --------------------------------------------------
  // Auth User
  // --------------------------------------------------

  const user = useSelector((state: RootState) => state.auth.user);

  // --------------------------------------------------
  // Redux Tasks
  // --------------------------------------------------

  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  // --------------------------------------------------
  // Local UI State
  // --------------------------------------------------

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // --------------------------------------------------
  // Fetch Tasks
  // --------------------------------------------------

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        title: "Task error",
        message: error,
      });
    }
  }, [error, showToast]);

  // --------------------------------------------------
  // Task Statistics
  // --------------------------------------------------

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.status === "DONE").length;

  const pendingTasks = tasks.filter((task) => task.status !== "DONE").length;

  // --------------------------------------------------
  // Greeting
  // --------------------------------------------------

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 17) {
      return "Good Afternoon";
    }

    return "Good Evening";
  };

  const openCreateTask = () => {
    setSelectedTask(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setIsConfirmOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
    setIsEditing(false);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedTask(null);
  };

  const refreshTasks = async () => {
    await dispatch(fetchTasks());
  };

  const openFilter = async () => {
    // simple filter example: toggle status 'DONE' or all
    const status = await new Promise<string | undefined>((resolve) => {
      // for simplicity, prompt via window.confirm isn't available; just fetch pending by default
      resolve(undefined);
    });

    dispatch(fetchTasks({ status }));
  };

  const openSort = async () => {
    // example: sort by dueDate asc
    dispatch(fetchTasks({ sortBy: "dueDate", order: "asc" }));
  };

  const handleFormSubmit = async (values: TaskFormValues) => {
    setActionLoading(true);

    try {
      const result =
        isEditing && selectedTask
          ? await dispatch(editTask({ id: selectedTask._id, data: values }))
          : await dispatch(addTask(values));

      if (result.meta.requestStatus === "fulfilled") {
        await refreshTasks();
        showToast({
          type: "success",
          title: isEditing ? "Task updated" : "Task created",
          message: isEditing
            ? "Task was updated successfully."
            : "Task was created successfully.",
        });
      } else {
        showToast({
          type: "error",
          title: "Task failed",
          message: "Unable to save the task. Please try again.",
        });
      }
    } finally {
      setActionLoading(false);
      closeForm();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTask) {
      return;
    }

    setActionLoading(true);

    try {
      const result = await dispatch(removeTask(selectedTask._id));

      if (result.meta.requestStatus === "fulfilled") {
        await refreshTasks();
        showToast({
          type: "success",
          title: "Task deleted",
          message: "Task was deleted successfully.",
        });
      } else {
        showToast({
          type: "error",
          title: "Delete failed",
          message: "Unable to delete the task. Please try again.",
        });
      }
    } finally {
      setActionLoading(false);
      closeConfirm();
    }
  };

  // --------------------------------------------------
  // Header
  // --------------------------------------------------

  const ListHeader = () => {
    return (
      <>
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>

            <Text style={styles.userName}>{user?.name || "there"}</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color={COLORS.text}
            />

            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats */}

        <View style={styles.statsContainer}>
          {/* Total */}

          <View style={[styles.statCard, styles.statCardTotal]}>
            <Text style={styles.statNumber}>{totalTasks}</Text>

            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>

          {/* Pending */}

          <View style={[styles.statCard, styles.statCardPending]}>
            <Text style={styles.statNumber}>{pendingTasks}</Text>

            <Text style={styles.statLabel}>Pending</Text>
          </View>

          {/* Completed */}

          <View style={[styles.statCard, styles.statCardCompleted]}>
            <Text style={styles.statNumber}>{completedTasks}</Text>

            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Quick Actions */}

        <View style={styles.quickActions}>
          {/* New Task */}

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={openCreateTask}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="add" size={25} color={COLORS.white} />
            </View>

            <Text style={styles.actionLabel}>New Task</Text>
          </TouchableOpacity>

          {/* Filter */}

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={openFilter}>
            <View style={[styles.actionIconContainer, styles.actionIconFilter]}>
              <Ionicons
                name="filter-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.actionLabel}>Filter</Text>
          </TouchableOpacity>

          {/* Sort */}
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={openSort}>
            <View style={[styles.actionIconContainer, styles.actionIconSort]}>
              <Ionicons
                name="swap-vertical-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.actionLabel}>Sort</Text>
          </TouchableOpacity>
        </View>

        {/* Task Section Header */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Tasks</Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* API Error */}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color={COLORS.danger}
            />

            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </>
    );
  };

  // --------------------------------------------------
  // Empty State
  // --------------------------------------------------

  const EmptyTasks = () => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="clipboard-outline" size={42} color={COLORS.gray} />
        </View>

        <Text style={styles.emptyTitle}>No Tasks Yet</Text>

        <Text style={styles.emptyText}>
          Create your first task to get started.
        </Text>

        <TouchableOpacity
          onPress={() => setIsFormOpen(true)}
          style={styles.emptyButton}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />

          <Text style={styles.emptyButtonText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <ListHeader />
        <FlatList
          style={{ flex: 1 }}
          data={tasks}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          ListEmptyComponent={
            loading && tasks.length === 0 ? (
              <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />

                  <Text style={styles.loadingText}>Loading tasks...</Text>
                </View>
              </SafeAreaView>
            ) : (
              <EmptyTasks />
            )
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TaskCard
              title={item.title}
              description={item.description || ""}
              priority={item.priority}
              status={item.status}
              dueDate={
                item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString()
                  : "No due date"
              }
              onEdit={() => openEditTask(item)}
              onDelete={() => openDeleteTask(item)}
            />
          )}
          ListFooterComponent={
            tasks.length > 0 ? <View style={styles.footerSpace} /> : null
          }
        />
      </View>

      <TaskFormModal
        visible={isFormOpen}
        title={isEditing ? "Edit Task" : "Create Task"}
        initialValues={
          selectedTask
            ? {
                title: selectedTask.title,
                description: selectedTask.description || "",
                priority: selectedTask.priority,
                status: selectedTask.status,
                dueDate: selectedTask.dueDate || "",
              }
            : undefined
        }
        loading={actionLoading}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <ConfirmModal
        visible={isConfirmOpen}
        message={
          selectedTask
            ? `Are you sure you want to delete "${selectedTask.title}"?`
            : "Delete this task?"
        }
        loading={actionLoading}
        onCancel={closeConfirm}
        onConfirm={handleDeleteConfirm}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

// ==================================================
// Styles
// ==================================================

const styles = StyleSheet.create({
  // ------------------------------------------------
  // Container
  // ------------------------------------------------

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: 50,
  },

  listContent: {
    paddingBottom: 20,
  },

  // ------------------------------------------------
  // Header
  // ------------------------------------------------

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  greeting: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 3,
  },

  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  notificationButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: COLORS.white,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  notificationBadge: {
    position: "absolute",

    top: 10,
    right: 10,

    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: COLORS.danger,

    borderWidth: 2,
    borderColor: COLORS.white,
  },

  // ------------------------------------------------
  // Stats
  // ------------------------------------------------

  statsContainer: {
    flexDirection: "row",

    paddingHorizontal: 20,

    gap: 10,

    marginBottom: 24,
  },

  statCard: {
    flex: 1,

    // borderRadius: 12,

    paddingVertical: 14,
    paddingHorizontal: 10,

    alignItems: "center",

    shadowColor: COLORS.text,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 1,
  },

  statCardTotal: {
    backgroundColor: COLORS.primary,
  },

  statCardPending: {
    backgroundColor: COLORS.warning,
  },

  statCardCompleted: {
    backgroundColor: COLORS.success,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "700",

    color: COLORS.white,

    marginBottom: 2,
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "500",

    color: COLORS.white,
  },

  // ------------------------------------------------
  // Quick Actions
  // ------------------------------------------------

  quickActions: {
    flexDirection: "row",

    justifyContent: "space-around",

    paddingHorizontal: 20,

    marginBottom: 28,
  },

  actionButton: {
    alignItems: "center",
  },

  actionIconContainer: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 6,

    shadowColor: COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 4,
  },

  actionIconFilter: {
    backgroundColor: COLORS.border,

    shadowColor: COLORS.text,

    shadowOpacity: 0.05,
  },

  actionIconSort: {
    backgroundColor: COLORS.border,

    shadowColor: COLORS.text,

    shadowOpacity: 0.05,
  },

  actionLabel: {
    fontSize: 12,

    color: COLORS.gray,

    fontWeight: "500",
  },

  // ------------------------------------------------
  // Section
  // ------------------------------------------------

  sectionHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingHorizontal: 20,

    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,

    fontWeight: "600",

    color: COLORS.text,
  },

  seeAllText: {
    fontSize: 14,

    color: COLORS.primary,

    fontWeight: "500",
  },

  // ------------------------------------------------
  // Task List
  // ------------------------------------------------

  separator: {
    height: 10,
  },

  footerSpace: {
    height: 10,
  },

  // ------------------------------------------------
  // Loading
  // ------------------------------------------------

  loadingContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,

    fontSize: 14,

    color: COLORS.gray,
  },

  // ------------------------------------------------
  // Empty State
  // ------------------------------------------------

  emptyContainer: {
    alignItems: "center",

    paddingHorizontal: 30,

    paddingVertical: 50,
  },

  emptyIconContainer: {
    width: 80,
    height: 80,

    // borderRadius: 40,

    backgroundColor: COLORS.border,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,

    fontWeight: "700",

    color: COLORS.text,
  },

  emptyText: {
    fontSize: 14,

    color: COLORS.gray,

    textAlign: "center",

    marginTop: 6,

    lineHeight: 20,
  },

  emptyButton: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,

    paddingHorizontal: 18,
    paddingVertical: 11,

    // borderRadius: 10,

    marginTop: 20,

    gap: 6,
  },

  emptyButtonText: {
    fontSize: 14,

    fontWeight: "600",

    color: COLORS.white,
  },

  // ------------------------------------------------
  // Error
  // ------------------------------------------------

  errorContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginHorizontal: 20,

    marginBottom: 16,

    padding: 12,

    // borderRadius: 10,

    backgroundColor: "#FEF2F2",

    borderWidth: 1,

    borderColor: COLORS.danger,
  },

  errorText: {
    flex: 1,

    marginLeft: 8,

    fontSize: 13,

    color: COLORS.danger,
  },
});
