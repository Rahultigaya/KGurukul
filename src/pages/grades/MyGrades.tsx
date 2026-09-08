import React from "react";
import { PageHeader } from "../../components/PageHeader";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  IconTrophy,
  IconAward,
  IconBook,
  IconChartBar,
  IconFileText,
  IconCheck,
} from "@tabler/icons-react";

interface SubjectGrade {
  subject: string;
  code: string;
  grade: string;
  score: number;
  total: number;
  gradePoint: number;
  status: "Pass" | "Distinction" | "Merit";
  teacher: string;
}

const mockGrades: SubjectGrade[] = [
  {
    subject: "Computer Science (Python & DSA)",
    code: "CS-101",
    grade: "A+",
    score: 95,
    total: 100,
    gradePoint: 10.0,
    status: "Distinction",
    teacher: "Prof. Santosh Chipdey",
  },
  {
    subject: "Web Development (React & Node.js)",
    code: "WD-201",
    grade: "A",
    score: 88,
    total: 100,
    gradePoint: 9.0,
    status: "Distinction",
    teacher: "Prof. Riyaa Chipdey",
  },
  {
    subject: "Database Management Systems",
    code: "DB-301",
    grade: "A",
    score: 84,
    total: 100,
    gradePoint: 9.0,
    status: "Merit",
    teacher: "Prof. Arjun Mehta",
  },
  {
    subject: "Mathematics for Computing",
    code: "MC-102",
    grade: "B+",
    score: 78,
    total: 100,
    gradePoint: 8.0,
    status: "Pass",
    teacher: "Prof. Shreya Agarwal",
  },
];

const MyGrades: React.FC = () => {
  const term = "Term 1 - 2026";

  const averageScore = Math.round(
    mockGrades.reduce((acc, g) => acc + g.score, 0) / mockGrades.length
  );
  const totalGradePoints = (
    mockGrades.reduce((acc, g) => acc + g.gradePoint, 0) / mockGrades.length
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <PageHeader
        title="My Grades & Performance"
        subtitle="Review your academic progress, examination results, and subject grades"
      />

      {/* ── Summary Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <IconTrophy size={26} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{totalGradePoints} / 10</p>
              <p className="text-xs font-semibold text-slate-500">Cumulative GPA</p>
            </div>
          </CardContent>
        </Card>

        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <IconChartBar size={26} />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">{averageScore}%</p>
              <p className="text-xs font-semibold text-slate-500">Overall Average</p>
            </div>
          </CardContent>
        </Card>

        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <IconBook size={26} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{mockGrades.length}</p>
              <p className="text-xs font-semibold text-slate-500">Graded Subjects</p>
            </div>
          </CardContent>
        </Card>

        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <IconAward size={26} />
            </div>
            <div>
              <p className="text-2xl font-black text-amber-600">Grade A</p>
              <p className="text-xs font-semibold text-slate-500">Current Standing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Grades Table Card ────────────────────────────────────────────── */}
      <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <IconFileText size={18} />
            </div>
            <div>
              <Typography variant="h6" className="!font-bold text-slate-800 !text-base">
                Subject Grade Sheet
              </Typography>
              <Typography variant="caption" className="text-slate-400 block">
                Academic Session: {term}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <IconCheck size={14} /> Passed All Subjects
            </span>
          </div>
        </div>

        <CardContent className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-6">Subject & Code</th>
                  <th className="py-3.5 px-6">Instructor</th>
                  <th className="py-3.5 px-6 text-center">Score</th>
                  <th className="py-3.5 px-6 text-center">Grade</th>
                  <th className="py-3.5 px-6 text-center">Grade Point</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {mockGrades.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800">{item.subject}</p>
                      <p className="text-xs text-slate-400 font-mono">{item.code}</p>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {item.teacher}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-block text-left w-24">
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>{item.score}</span>
                          <span className="text-slate-400">/ {item.total}</span>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={item.score}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "#e2e8f0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: item.score >= 90 ? "#16a34a" : item.score >= 80 ? "#2563eb" : "#f59e0b",
                              borderRadius: 3,
                            },
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      {item.gradePoint.toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          borderRadius: "8px",
                          height: "24px",
                          bgcolor: item.status === "Distinction" ? "#eff6ff" : item.status === "Merit" ? "#f0fdf4" : "#f8fafc",
                          color: item.status === "Distinction" ? "#1d4ed8" : item.status === "Merit" ? "#15803d" : "#475569",
                          border: `1px solid ${
                            item.status === "Distinction" ? "#bfdbfe" : item.status === "Merit" ? "#bbf7d0" : "#cbd5e1"
                          }`,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyGrades;
