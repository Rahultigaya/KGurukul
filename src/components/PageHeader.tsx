import React from "react";
import { useNavigate } from "react-router-dom";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBack = true,
  action,
  children,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 transition-colors text-secondary flex items-center justify-center shadow-sm"
            title="Go Back"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-bold text-secondary mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(action || children) && (
        <div className="flex items-center gap-3">
          {action}
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
