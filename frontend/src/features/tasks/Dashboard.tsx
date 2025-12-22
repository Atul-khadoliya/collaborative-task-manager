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

type ViewMode = "ASSIGNED" | "CREATED" | "OVERDUE";
type SortOrder = "ASC" | "DESC";

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

  /* 🔍 VIEW / FILTER / SORT STATE */
  const [view, setView] = useState<ViewMode>("ASSIGNED");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | Task["status"]>("ALL");
  const [priorityFilter, setPriorityFilter] =
    useState<"ALL" | Task["priority"]>("ALL");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("ASC");

  /* ⚠️ DEMO WARNING */
  const [assignWarning, setAssignWarning] = useState<{
    email: string;
    password: string;
  } | null>(null);

  /* 🔑 CONTROLLED INPUT */
  const [assigneeInput, setAssigneeInput] = useState<
    Record<string, string>
  >({});

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
      data: Partial<
        Pick<Task, "status" | "priority" | "assignedToId">
      >;
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

  /* 🔎 APPLY VIEW + FILTERS + SORT */
  const filteredTasks = data
    ?.filter((task) => {
      if (!userId) return false;

      if (view === "ASSIGNED" && task.assignedToId !== userId)
        return false;

      if (view === "CREATED" && task.creatorId !== userId)
        return false;

      if (
        view === "OVERDUE" &&
        !(isOverdue(task.dueDate) && task.status !== "COMPLETED")
      )
        return false;

      if (
        statusFilter !== "ALL" &&
        task.status !== statusFilter
      )
        return false;

      if (
        priorityFilter !== "ALL" &&
        task.priority !== priorityFilter
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      const diff =
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime();
      return sortOrder === "ASC" ? diff : -diff;
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

      {/* 🔀 VIEW TABS */}
      <div className="mb-4 flex gap-2">
        {(["ASSIGNED", "CREATED", "OVERDUE"] as ViewMode[]).map(
          (v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded text-sm font-medium ${view === v
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              {v}
            </button>
          )
        )}
      </div>

      {/* 🔍 FILTERS */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as any)
          }
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as any)
          }
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as SortOrder)
          }
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ASC">Due Date ↑</option>
          <option value="DESC">Due Date ↓</option>
        </select>
      </div>

      {/* ⚠️ DEMO WARNING */}
      {assignWarning && (
        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm">
          <strong>Demo user assigned.</strong>
          <div className="mt-1 font-mono">
            📧 {assignWarning.email} <br />
            🔑 {assignWarning.password}
          </div>
        </div>
      )}

      <CreateTaskForm
        onAssignedToTestUser={(email, password) => {
          setAssignWarning({ email, password });
          setTimeout(() => setAssignWarning(null), 6000);
        }}
      />


      <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks?.map((task) => {
          const isAssignedToMe = task.assignedToId === userId;

          return (
            <li
              key={task.id}
              className="bg-white rounded-2xl border p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>

              {task.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {task.description}
                </p>
              )}

              {/* STATUS */}
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
                className="mt-4 w-full border rounded px-2 py-1 text-sm"
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>

              {/* ASSIGNEE */}
              <input
                list={`users-${task.id}`}
                value={
                  assigneeInput[task.id] ??
                  (isAssignedToMe
                    ? "Me"
                    : TEST_USERS.find(
                      (u) => u.id === task.assignedToId
                    )?.name || "")
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setAssigneeInput((p) => ({
                    ...p,
                    [task.id]: value,
                  }));

                  const found = TEST_USERS.find(
                    (u) =>
                      u.name.toLowerCase() === value.toLowerCase()
                  );

                  if (found) {
                    updateMutation.mutate({
                      taskId: task.id,
                      data: { assignedToId: found.id },
                    });
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
                className="mt-3 w-full border rounded px-2 py-1 text-sm"
              />

              <datalist id={`users-${task.id}`}>
                <option value="Me" />
                {TEST_USERS.map((u) => (
                  <option key={u.id} value={u.name} />
                ))}
              </datalist>

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
