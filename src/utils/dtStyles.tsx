// src/utils/dtStyles.tsx
//
// Reusable dark theme styles for react-data-table-component.
// Usage:
//   import { dtStyles, sortIcon } from "../../../utils/dtStyles";
//   <DataTable customStyles={dtStyles} sortIcon={sortIcon} ... />

export const dtStyles = {
  table: {
    style: { backgroundColor: "transparent" },
  },
  headRow: {
    style: {
      backgroundColor: "rgba(15,23,42,0.9)",
      borderBottomColor: "rgba(100,116,139,0.3)",
    },
  },
  headCells: {
    style: { color: "#e2e8f0" },
  },
  sortIcon: {
    style: { color: "#e2e8f0", fill: "#e2e8f0", opacity: 1 },
  },
  rows: {
    style: { backgroundColor: "rgba(15,23,42,0.6)" },
    highlightOnHoverStyle: {
      backgroundColor: "rgba(30,41,59,0.9)",
      borderBottomColor: "rgba(100,116,139,0.2)",
      outline: "none",
      cursor: "default",
    },
  },
  pagination: {
    style: {
      backgroundColor: "rgba(15,23,42,0.9)",
      borderTopColor: "rgba(100,116,139,0.3)",
      color: "#cbd5e1",
    },
    pageButtonsStyle: {
      fill: "#e2e8f0",
      "&:disabled": { fill: "rgba(148,163,184,0.25)" },
      "&:hover:not(:disabled)": {
        backgroundColor: "rgba(100,116,139,0.25)",
        fill: "#f97316",
      },
    },
  },
  noData: {
    style: { backgroundColor: "rgba(15,23,42,0.6)", color: "#64748b" },
  },
  // ── Rows-per-page select dropdown ────────────────────────────────────────
  // The native <select> and its <option> elements need inline background
  // because CSS-in-JS cannot target <option> tags in most browsers.
  select: {
    style: {
      backgroundColor: "#0f172a", // dark background for the select box
      color: "#e2e8f0", // light text
      border: "1px solid rgba(100,116,139,0.4)",
      borderRadius: "6px",
      padding: "2px 6px",
      cursor: "pointer",
      outline: "none",
    },
  },
};

export const sortIcon = (
  <span style={{ color: "#e2e8f0", fontSize: 12, marginLeft: 4 }}>↕</span>
);
