import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  Task,
  CreateTaskData,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task.api";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await getTasks();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (
    data: CreateTaskData,
    { rejectWithValue }
  ) => {
    try {
      return await createTask(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);


export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTaskData>;
    },
    { rejectWithValue }
  ) => {
    try {
      return await updateTask(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);


export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      await deleteTask(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // GET TASKS
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // CREATE TASK
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks.unshift(action.payload);
      })

      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // UPDATE TASK
    builder
      .addCase(editTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(editTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // DELETE TASK
    builder
      .addCase(removeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload
        );
      })

      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTasks } = taskSlice.actions;

export default taskSlice.reducer;