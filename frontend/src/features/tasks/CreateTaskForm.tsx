import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./task.api";

/* 🔧 SAME TEST USERS (DEMO ONLY) */
const TEST_USERS = [
  {
    id: "b638c3dd-c885-4814-96b0-f561344eee38",
    email: "alice@gmail.com",
    password: "123456",
  },
  {
    id: "cfa75c7b-ef24-4042-9657-5c1b01dd982d",
    email: "bob@gmail.com",
    password: "123456",
  },
  {
    id: "431e33af-22de-4794-8be6-9e1d7142d3ad",
    email: "charlie@gmail.com",
    password: "123456",
  },
];

interface CreateTaskFormProps {
  onAssignedToTestUser?: (email: string, password: string) => void;
}

function CreateTaskForm({ onAssignedToTestUser }: CreateTaskFormProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] =
    useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [status, setStatus] =
    useState<"TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED">("TODO");
  const [assignedToId, setAssignedToId] = useState("");

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // ⚠️ DEMO WARNING TRIGGER
      const found = TEST_USERS.find(
        (u) => u.id === payload.assignedToId
      );

      if (found && onAssignedToTestUser) {
        onAssignedToTestUser(found.email, found.password);
      }

      // reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("MEDIUM");
      setStatus("TODO");
      setAssignedToId("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          title,
          description,
          dueDate,
          priority,
          status,
          assignedToId,
        });
      }}
      className="mb-8 rounded-xl border p-6 bg-white"
    >
      <h2 className="font-semibold mb-4">Create Task</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mb-3 w-full border rounded px-3 py-2"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="mb-3 w-full border rounded px-3 py-2"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="mb-3 w-full border rounded px-3 py-2"
        required
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as typeof priority)
        }
        className="mb-3 w-full border rounded px-3 py-2"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as typeof status)
        }
        className="mb-3 w-full border rounded px-3 py-2"
      >
        <option value="TODO">Todo</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="REVIEW">Review</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select
        value={assignedToId}
        onChange={(e) => setAssignedToId(e.target.value)}
        className="mb-4 w-full border rounded px-3 py-2"
        required
      >
        <option value="">Assign to</option>
        <option value="b638c3dd-c885-4814-96b0-f561344eee38">
          Alice (Test)
        </option>
        <option value="cfa75c7b-ef24-4042-9657-5c1b01dd982d">
          Bob (Test)
        </option>
        <option value="431e33af-22de-4794-8be6-9e1d7142d3ad">
          Charlie (Test)
        </option>
      </select>

      <button
        type="submit"
        className="rounded bg-indigo-600 px-4 py-2 text-white"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Creating…" : "Create Task"}
      </button>
    </form>
  );
}

export default CreateTaskForm;
