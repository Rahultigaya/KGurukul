import React, { useState } from "react";
import TaskCard from "./Taskcard";

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "mathematics" | "languages" | "archives"
  >("languages");

  const tasks = [
    {
      id: "1",
      title: "Words and Tales about Animals",
      grade: "5-B grade",
      status: "completed" as const,
      launchDate: "31 May, 2016",
      daysLeft: 7,
      icon: "📚",
    },
    {
      id: "2",
      title: "My Dad's Got an Alligator",
      grade: "6-C grade",
      status: "in-progress" as const,
      launchDate: "27 May, 2016",
      daysLeft: 13,
      icon: "🐊",
    },
    {
      id: "3",
      title: "Goodnight Already!",
      grade: "5-B grade",
      status: "completed" as const,
      launchDate: "27 May, 2016",
      daysLeft: 10,
      icon: "🌙",
    },
    {
      id: "4",
      title: "The Cat Who Drank the Moon",
      grade: "6-A grade",
      status: "in-progress" as const,
      launchDate: "24 May, 2016",
      daysLeft: 7,
      icon: "🐱",
    },
    {
      id: "5",
      title: "Long Necks",
      grade: "6-A grade",
      status: "not-started" as const,
      launchDate: "20 May, 2016",
      daysLeft: 5,
      icon: "🦒",
    },
    {
      id: "6",
      title: "The Wonderful Things You Will Be",
      grade: "5-B grade",
      status: "not-started" as const,
      launchDate: "13 May, 2016",
      daysLeft: 3,
      icon: "✨",
    },
    {
      id: "7",
      title: "If Animals Kissed Good Night",
      grade: "5-B grade",
      status: "not-started" as const,
      launchDate: "10 May, 2016",
      daysLeft: 1,
      icon: "💕",
    },
  ];

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Current Tasks</h2>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Task
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("mathematics")}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === "mathematics"
                ? "text-green-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Mathematics
            {activeTab === "mathematics" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("languages")}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === "languages"
                ? "text-orange-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Languages
            {activeTab === "languages" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("archives")}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === "archives"
                ? "text-green-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Archives
            {activeTab === "archives" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"></div>
            )}
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="mb-4 px-4 flex items-center justify-between text-sm font-medium text-gray-400">
        <div className="flex-1">Tasks</div>
        <div className="flex items-center gap-4">
          <div className="min-w-[80px] text-center">Grade</div>
          <div className="min-w-[100px] text-center">Done</div>
          <div className="min-w-[100px] text-center">Launch date</div>
          <div className="min-w-[60px] text-center">Left</div>
          <div className="w-[80px]"></div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-white">{tasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-400">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-orange-400">
                {tasks.filter((t) => t.status === "in-progress").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
