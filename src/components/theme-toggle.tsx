"use client";
import { FiMoon, FiSun } from "react-icons/fi";

function currentTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const toggle = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked: the choice just won't persist
    }
  };

  // Both icons render; CSS picks one, so server and client markup match.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={`group relative flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink ${className}`}
    >
      <FiMoon className="h-4 w-4 dark:hidden" />
      <FiSun className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
