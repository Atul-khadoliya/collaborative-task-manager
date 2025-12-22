import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./task.api";
import { getUserIdFromToken } from "../../lib/jwt";

/* 🔧 TEMP TEST USERS */
const TEST_USERS = [
  {
    id: "b638c3dd-c885-4814-96b0-f561344eee38",
    name: "Alice (Test)",
    email: "alice@gmail.com",
    password: "123456",
  },
  {
    id: "cfa75c7b-ef24-4042-9657-5c1b01dd982d",
    name: "Bob (Test)",
    email: "bob@gmail.com",
    password: "123456",
  },
  {
    id: "431e33af-22de-4794-8be6-9e1d7142d3ad",
    name: "Charlie (Test)",
    email: "charlie@gmail.com",
    password: "123456",
  },
];

interface CreateTaskFormProps {
  onAssignedToTestUser?: (email: string, password: string) => void;
}

function CreateTaskForm({ onAssignedToTestUser }: CreateTaskFormProps) {
  const queryClient = useQueryClient();
  const currentUserId = getUserIdFromToken();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<"TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED">("TODO");
  const [priority, setPriority] =
    useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [assigneeName, setAssigneeName] = useState("");
  const [assignedToId, setAssignedToId] = useState("");

  useEffect(() => {
    if (currentUserId) {
      setAssigneeName("Me");
      setAssignedToId(currentUserId);
    }
  }, [currentUserId]);

  const mutation = useMutation({
    mutationFn: () =>
      createTask({
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        status,
        assignedToId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      const testUser = TEST_USERS.find(
        (u) => u.id === assignedToId
      );

      if (testUser && onAssignedToTestUser) {
        onAssignedToTestUser(testUser.email, testUser.password);
      }

      setTitle("");
      setDescription("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setDueDate("");
      setAssigneeName("Me");
      setAssignedToId(currentUserId || "");
    },
  });

  const handleAssigneeChange = (value: string) => {
    setAssigneeName(value);

    if (value === "Me" && currentUserId) {
      setAssignedToId(currentUserId);
      return;
    }

    const found = TEST_USERS.find(
      (u) => u.name.toLowerCase() === value.toLowerCase()
    );

    setAssignedToId(found ? found.id : "");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="mb-8 space-y-3 bg-white p-4 rounded-lg border shadow-sm"
    >
      <h3 className="font-semibold text-lg">Create Task</h3>

      <input
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

      <div className="grid grid-cols-2 gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border px-3 py-2 rounded"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="border px-3 py-2 rounded"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <input
        list="users"
        value={assigneeName}
        onChange={(e) => handleAssigneeChange(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <datalist id="users">
        <option value="Me" />
        {TEST_USERS.map((u) => (
          <option key={u.id} value={u.name} />
        ))}
      </datalist>

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
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {mutation.isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

export default CreateTaskForm;
