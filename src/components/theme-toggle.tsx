"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80"
      aria-label="切換主題"
    >
      <span className="block dark:hidden">🌙</span>
      <span className="hidden dark:block">☀️</span>
    </button>
  );
}
