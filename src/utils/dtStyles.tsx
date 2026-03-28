// src/utils/dtStyles.tsx


export const dtStyles = {
  table: {
    style: { backgroundColor: "transparent" },
  },
  headRow: {
    style: {
      backgroundColor: "var(--bg-secondary)",
      borderBottomColor: "var(--border-default)",
    },
  },
  headCells: {
    style: {
      color: "var(--text-primary)",
      fontWeight: 600,
      fontSize: "13px",
    },
  },
  sortIcon: {
    style: { color: "var(--text-primary)", fill: "var(--text-primary)", opacity: 1 },
  },
  rows: {
    style: {
      backgroundColor: "var(--bg-card)",
      borderBottomColor: "var(--border-default)",
      color: "var(--text-primary)",
    },
    highlightOnHoverStyle: {
      backgroundColor: "var(--bg-card-hover)",
      borderBottomColor: "var(--border-default)",
      outline: "none",
      cursor: "default",
    },
  },
  pagination: {
    style: {
      backgroundColor: "var(--bg-secondary)",
      borderTopColor: "var(--border-default)",
      color: "var(--text-secondary)",
    },
    pageButtonsStyle: {
      fill: "var(--text-secondary)",
      "&:disabled": { fill: "var(--text-muted)" },
      "&:hover:not(:disabled)": {
        backgroundColor: "var(--bg-tertiary)",
        fill: "var(--accent-orange)",
      },
    },
  },
  noData: {
    style: {
      backgroundColor: "var(--bg-card)",
      color: "var(--text-muted)",
    },
  },
  select: {
    style: {
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-default)",
      borderRadius: "6px",
      padding: "2px 6px",
      cursor: "pointer",
      outline: "none",
    },
  },
};

export const sortIcon = (
  <span style={{ color: "var(--text-secondary)", fontSize: 12, marginLeft: 4 }}>↕</span>
);

export const selectDropdownStyles = {
  comboboxProps: {
    styles: {
      dropdown: {
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      },
    },
  },
  styles: {
    option: {
      color: "var(--text-primary)",
      backgroundColor: "var(--bg-secondary)",
    },
  },
};