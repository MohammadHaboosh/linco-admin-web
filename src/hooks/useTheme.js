import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "linco-theme";

const getInitialTheme = () => {
  const documentTheme = document.documentElement.dataset.theme;

  if (documentTheme === "light" || documentTheme === "dark") {
    return documentTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme selection still works when storage is unavailable.
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#080f1e" : "#0a2a54");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;
