import api from "./axios";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
}

// GET /api/tasks
export const getTasks = async (params?: { status?: string; priority?: string; sortBy?: string; order?: string }): Promise<Task[]> => {
  const response = await api.get("/tasks", { params });

  return response.data.data;
};

// POST /api/tasks
export const createTask = async (
  data: CreateTaskData
): Promise<Task> => {
  const response = await api.post("/tasks", data);

  return response.data.data;
};

// GET /api/tasks/:id
export const getTaskById = async (
  id: string
): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);

  return response.data.data;
};

// PUT /api/tasks/:id
export const updateTask = async (
  id: string,
  data: Partial<CreateTaskData>
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);

  return response.data.data;
};

// DELETE /api/tasks/:id
export const deleteTask = async (
  id: string
): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};