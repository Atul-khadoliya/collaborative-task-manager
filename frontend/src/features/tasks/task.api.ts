import { apiClient } from "../../lib/apiClient";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: string;
  assignedToId: string;
  createdAt: string;
}

// -------------------- QUERIES --------------------

export const getTasks = async (): Promise<Task[]> => {
  return apiClient<Task[]>("/tasks");
};

// -------------------- MUTATIONS --------------------

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  assignedToId: string;
  status?: TaskStatus;
}

export const createTask = async (
  input: CreateTaskInput
): Promise<void> => {
  return apiClient<void>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
};

// 🔴 THIS WAS MISSING — ADD IT
export const updateTask = async (
  taskId: string,
  input: Partial<Pick<Task, "status" | "priority" | "assignedToId">>
): Promise<void> => {
  return apiClient<void>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
};
