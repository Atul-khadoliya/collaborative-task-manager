import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./task.api";
import { getUserIdFromToken } from "../../lib/jwt";

/* 🔧 TEMP TEST USERS */
const TEST_USERS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Alice (Test)" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Bob (Test)" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Charlie (Test)" },
];

function CreateTaskForm() {
  const queryClient = useQueryClient();
  const currentUserId = getUserIdFromToken();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<"TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED">("TODO");
  const [priority, setPriority] =
    useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  // 🔑 assignment (UI + backend split)
  const [assigneeName, setAssigneeName] = useState("");
  const [assignedToId, setAssignedToId] = useState<string>("");

  /* default assign → self */
  useEffect(() => {
    if (currentUserId) {
      setAssigneeName("Me");
      setAssignedToId(currentUserId);
    }
  }, [currentUserId]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!assignedToId) {
        throw new Error("Please select a valid assignee");
      }

      return createTask({
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        status,
        assignedToId,
      });
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setDueDate("");
      setAssigneeName("Me");
      setAssignedToId(currentUserId || "");

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

      {/* ✅ TYPE + SELECT ASSIGNEE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Assign to
        </label>

        <input
          list="users"
          placeholder="Type a name or select"
          value={assigneeName}
          onFocus={() => {
            if (assigneeName === "Me") setAssigneeName("");
          }}
          onChange={(e) => handleAssigneeChange(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <p className="text-xs text-gray-500 mt-1">
          Start typing to see suggestions
        </p>

        <datalist id="users">
          <option value="Me" />
          {TEST_USERS.map((user) => (
            <option key={user.id} value={user.name} />
          ))}
        </datalist>
      </div>

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
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {mutation.isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

export default CreateTaskForm;
