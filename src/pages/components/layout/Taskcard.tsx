import React from "react";

interface Task {
  id: string;
  title: string;
  grade: string;
  status: "completed" | "in-progress" | "not-started";
  launchDate: string;
  daysLeft: number;
  icon?: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-900 text-green-300";
      case "in-progress":
        return "bg-blue-900 text-blue-300";
      case "not-started":
        return "bg-gray-700 text-gray-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return `${task.daysLeft}/${task.daysLeft}`;
      case "in-progress":
        return `${Math.floor(task.daysLeft / 2)}/${task.daysLeft}`;
      case "not-started":
        return `0/${task.daysLeft}`;
      default:
        return "0/0";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:shadow-lg hover:border-gray-600 transition-all">
      <div className="flex items-center gap-4 flex-1">
        {task.icon && (
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">{task.icon}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{task.title}</h3>
          <p className="text-sm text-gray-400">{task.grade}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
        >
          {getStatusLabel(task.status)}
        </span>
        <div className="text-sm text-gray-400 min-w-[100px] text-center">
          {task.launchDate}
        </div>
        <div className="text-sm text-gray-400 min-w-[60px] text-center">
          {task.daysLeft} days
        </div>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-700 rounded transition-colors">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-700 rounded transition-colors">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
