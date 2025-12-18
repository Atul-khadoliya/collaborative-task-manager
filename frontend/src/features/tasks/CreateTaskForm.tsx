import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./task.api";
import { getUserIdFromToken } from "../../lib/jwt";

function CreateTaskForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED">("TODO");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Not authenticated");

      return createTask({
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        status,
        assignedToId: userId,
      });
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setDueDate("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="mb-6 space-y-2"
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        required
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        rows={3}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="border px-3 py-2 rounded w-full"
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="REVIEW">Review</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as any)}
        className="border px-3 py-2 rounded w-full"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        required
      />

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {mutation.isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

export default CreateTaskForm;
