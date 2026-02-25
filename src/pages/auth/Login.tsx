import React from "react";
import LoginForm from "./components/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 md:p-20 overflow-hidden">
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] border border-slate-200 hover:border-purple-400">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side - Login Form */}
          <div className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto">
            <LoginForm />
          </div>

          {/* Right Side - Image/Illustration (Hidden on mobile) */}
          <div className="hidden md:block w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <img
              src="/programming_logo.png"
              alt="Programming Languages"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
