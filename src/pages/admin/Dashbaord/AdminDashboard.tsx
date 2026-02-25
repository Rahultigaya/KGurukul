import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div>
      {/* Put your page content here */}
      <h1 className="text-3xl font-bold text-white mb-4">Your Page Title</h1>

      {/* Your content */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <p className="text-white">Your content goes here...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
