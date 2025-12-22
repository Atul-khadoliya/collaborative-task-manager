import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getTasks, type Task, updateTask } from "./task.api";
import CreateTaskForm from "./CreateTaskForm";
import { getUserIdFromToken } from "../../lib/jwt";

/* 🔧 TEMP TEST USERS (DEMO ONLY) */
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

function Dashboard() {
  const queryClient = useQueryClient();
  const userId = getUserIdFromToken();

  // ⚠️ DEMO WARNING STATE
  const [assignWarning, setAssignWarning] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<Pick<Task, "status" | "priority" | "assignedToId">>;
    }) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  if (isLoading)
    return <div className="p-10 text-center">Loading tasks…</div>;

  if (isError)
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load tasks
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

      {/* ⚠️ DEMO WARNING BANNER */}
      {assignWarning && (
        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          <strong>Demo User Assigned.</strong>
          <div className="mt-1">
            Log in with:
            <div className="mt-1 font-mono">
              📧 {assignWarning.email} <br />
              🔑 {assignWarning.password}
            </div>
            to check notifications.
          </div>
        </div>
      )}

      <CreateTaskForm />

      <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((task) => {
          const isAssignedToMe = task.assignedToId === userId;

          return (
            <li
              key={task.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm ${
                isOverdue(task.dueDate) && task.status !== "COMPLETED"
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>

              {task.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {task.description}
                </p>
              )}

              {/* STATUS */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-500">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateMutation.mutate({
                      taskId: task.id,
                      data: {
                        status: e.target.value as Task["status"],
                      },
                    })
                  }
                  className="mt-1 w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* PRIORITY */}
              <div className="mt-3">
                <label className="text-xs font-semibold text-gray-500">
                  Priority
                </label>
                <select
                  value={task.priority}
                  onChange={(e) =>
                    updateMutation.mutate({
                      taskId: task.id,
                      data: {
                        priority: e.target.value as Task["priority"],
                      },
                    })
                  }
                  className="mt-1 w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* ASSIGNEE */}
              <div className="mt-3">
                <label className="text-xs font-semibold text-gray-500">
                  Assignee
                </label>

                <input
                  list={`users-${task.id}`}
                  defaultValue={
                    isAssignedToMe
                      ? "Me"
                      : TEST_USERS.find(
                          (u) => u.id === task.assignedToId
                        )?.name || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "Me" && userId) {
                      updateMutation.mutate({
                        taskId: task.id,
                        data: { assignedToId: userId },
                      });
                      return;
                    }

                    const found = TEST_USERS.find(
                      (u) =>
                        u.name.toLowerCase() === value.toLowerCase()
                    );

                    if (found) {
                      updateMutation.mutate({
                        taskId: task.id,
                        data: { assignedToId: found.id },
                      });

                      // ⚠️ SHOW DEMO WARNING
                      setAssignWarning({
                        email: found.email,
                        password: found.password,
                      });

                      setTimeout(
                        () => setAssignWarning(null),
                        6000
                      );
                    }
                  }}
                  className="mt-1 w-full border rounded px-2 py-1 text-sm"
                />

                <datalist id={`users-${task.id}`}>
                  <option value="Me" />
                  {TEST_USERS.map((u) => (
                    <option key={u.id} value={u.name} />
                  ))}
                </datalist>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Due · {formatDate(task.dueDate)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Dashboard;
