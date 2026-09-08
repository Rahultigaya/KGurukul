// src/utils/dtStyles.tsx

export const dtStyles = {
  table: {
    style: { backgroundColor: "transparent" },
  },
  headRow: {
    style: {
      backgroundColor: "#f8fafc",
      borderBottomColor: "#e2e8f0",
    },
  },
  headCells: {
    style: {
      color: "#0f172a",
      fontWeight: 600,
      fontSize: "13px",
    },
  },
  sortIcon: {
    style: { color: "#64748b", fill: "#64748b", opacity: 1 },
  },
  rows: {
    style: {
      backgroundColor: "#ffffff",
      borderBottomColor: "#f1f5f9",
      color: "#0f172a",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#f8fafc",
      borderBottomColor: "#e2e8f0",
      outline: "none",
      cursor: "default",
    },
  },
  pagination: {
    style: {
      backgroundColor: "#f8fafc",
      borderTopColor: "#e2e8f0",
      color: "#475569",
    },
    pageButtonsStyle: {
      fill: "#475569",
      "&:disabled": { fill: "#cbd5e1" },
      "&:hover:not(:disabled)": {
        backgroundColor: "#f1f5f9",
        fill: "#2563eb",
      },
    },
  },
  noData: {
    style: {
      backgroundColor: "#ffffff",
      color: "#94a3b8",
    },
  },
  select: {
    style: {
      backgroundColor: "#ffffff",
      color: "#0f172a",
      border: "1px solid #cbd5e1",
      borderRadius: "6px",
      padding: "2px 6px",
      cursor: "pointer",
      outline: "none",
    },
  },
};

export const sortIcon = (
  <span style={{ color: "#64748b", fontSize: 12, marginLeft: 4 }}>↕</span>
);

export const selectDropdownStyles = {
  comboboxProps: {
    styles: {
      dropdown: {
        background: "#ffffff",
        border: "1px solid #cbd5e1",
        color: "#0f172a",
      },
    },
  },
  styles: {
    option: {
      color: "#0f172a",
      backgroundColor: "#ffffff",
    },
  },
};