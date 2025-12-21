import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getTasks, type Task, updateTask } from "./task.api";
import CreateTaskForm from "./CreateTaskForm";
import { getUserIdFromToken } from "../../lib/jwt";

/* 🔧 TEMP TEST USERS */
const TEST_USERS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Alice (Test)" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Bob (Test)" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Charlie (Test)" },
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
    return <div className="p-10 text-center text-red-600">Failed to load</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

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
                      data: { status: e.target.value as Task["status"] },
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
                      data: { priority: e.target.value as Task["priority"] },
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
                      : TEST_USERS.find((u) => u.id === task.assignedToId)
                          ?.name || ""
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
