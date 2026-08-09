import api from "./axios";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data.data as User;
};

export const updateProfile = async (payload: { name?: string; email?: string }) => {
  const response = await api.put("/users/profile", payload);
  return response.data.data as User;
};

export default {};
