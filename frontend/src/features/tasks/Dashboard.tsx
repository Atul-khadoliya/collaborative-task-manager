import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks, type Task } from "./task.api";
import CreateTaskForm from "./CreateTaskForm";

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


function statusClass(status: string) {
  switch (status) {
    case "TODO":
      return "bg-gray-200 text-gray-800";
    case "IN_PROGRESS":
      return "bg-blue-200 text-blue-800";
    case "REVIEW":
      return "bg-yellow-200 text-yellow-800";
    case "COMPLETED":
      return "bg-green-200 text-green-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

function priorityClass(priority: string) {
  switch (priority) {
    case "LOW":
      return "bg-green-100 text-green-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "URGENT":
      return "bg-red-200 text-red-900";
    default:
      return "bg-gray-100 text-gray-800";
  }
}


function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });


  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED">("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState<"ALL" | "LOW" | "MEDIUM" | "HIGH" | "URGENT">("ALL");


  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (isError) {
    return <p>Failed to load tasks.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as any)}
        className="border px-3 py-2 rounded mb-4"
      >
        <option value="ALL">All</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="REVIEW">Review</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value as any)}
        className="border px-3 py-2 rounded mb-4 ml-2"
      >
        <option value="ALL">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>


      <CreateTaskForm />


      {data && data.length === 0 && (
        <p className="text-gray-600">No tasks found.</p>
      )}

      <ul className="space-y-2">
        {data
          ?.filter((task: Task) => {
            const statusMatch =
              statusFilter === "ALL" || task.status === statusFilter;

            const priorityMatch =
              priorityFilter === "ALL" || task.priority === priorityFilter;

            return statusMatch && priorityMatch;
          })
          .sort(
            (a: Task, b: Task) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .map((task: Task) => (
            <li
              key={task.id}
              className={`p-4 rounded shadow space-y-1 ${isOverdue(task.dueDate) && task.status !== "COMPLETED"
                ? "bg-red-50 border border-red-300"
                : "bg-white"
                }`}
            >
              <h2 className="font-medium text-lg">{task.title}</h2>

              {task.description && (
                <p className="text-sm text-gray-700">{task.description}</p>
              )}

              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`px-2 py-1 rounded ${statusClass(task.status)}`}
                >
                  {task.status.replace("_", " ")}
                </span>

                <span
                  className={`px-2 py-1 rounded ${priorityClass(task.priority)}`}
                >
                  {task.priority}
                </span>

                <span className="text-gray-600">
                  Due: {formatDate(task.dueDate)}
                </span>
              </div>

            </li>

          ))}
      </ul>
    </div>
  );
}

export default Dashboard;

