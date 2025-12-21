import { useMutation } from "@tanstack/react-query";
import {
  type Task,
  type TaskStatus,
  type TaskPriority,
  updateTask,
} from "../features/tasks/task.api";

interface TaskCardProps {
  task: Task;
}

const statusOptions: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
];

const priorityOptions: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

function TaskCard({ task }: TaskCardProps) {
  const mutation = useMutation({
    mutationFn: (payload: {
      status?: TaskStatus;
      priority?: TaskPriority;
    }) => updateTask(task.id, payload),
  });

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    mutation.mutate({
      status: e.target.value as TaskStatus,
    });
  };

  const handlePriorityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    mutation.mutate({
      priority: e.target.value as TaskPriority,
    });
  };

  return (
    <li
      className={`p-5 rounded-xl border space-y-3
        transition-shadow duration-200 hover:shadow-md
        ${
          task.status !== "COMPLETED" &&
          new Date(task.dueDate) < new Date()
            ? "bg-red-50 border-red-300"
            : "bg-white border-gray-200"
        }`}
    >
      <h2 className="font-semibold text-lg text-gray-900">
        {task.title}
      </h2>

      {task.description && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-3 text-sm">
        {/* Status */}
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={mutation.isPending}
          className="
            border border-gray-300 rounded-full
            px-3 py-1.5 bg-gray-50
            text-xs font-medium text-gray-800
            focus:outline-none
            disabled:opacity-60
          "
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={task.priority}
          onChange={handlePriorityChange}
          disabled={mutation.isPending}
          className="
            border border-gray-300 rounded-full
            px-3 py-1.5 bg-gray-50
            text-xs font-medium text-gray-800
            focus:outline-none
            disabled:opacity-60
          "
        >
          {priorityOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs font-medium text-gray-500">
          Due · {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </li>
  );
}
