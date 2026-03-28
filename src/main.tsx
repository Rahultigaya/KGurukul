// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";

// Inner component so it can read ThemeContext
const AppWithMantine = () => {
  const { theme } = useTheme();
  return (
    <MantineProvider colorScheme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWithMantine />
    </ThemeProvider>
  </StrictMode>
);