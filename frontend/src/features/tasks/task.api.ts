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

export const getTasks = async (): Promise<Task[]> => {
  return apiClient<Task[]>("/tasks");
};

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  assignedToId: string;
  status? : string ;
}

export const createTask = async (
  input: CreateTaskInput
): Promise<void> => {
  return apiClient<void>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
};
