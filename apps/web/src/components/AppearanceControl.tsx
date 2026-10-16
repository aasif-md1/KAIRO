"use client";

import React, { useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";

interface AppearanceControlProps {
  id?: string;
  className?: string;
}

export function AppearanceControl({ id = "appearance-control", className }: AppearanceControlProps) {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("kairo-theme") as ThemePreference | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setTheme(stored);
    }
  }, []);

  const handleSelect = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    localStorage.setItem("kairo-theme", nextTheme);

    const root = document.documentElement;
    if (nextTheme === "system") {
      root.removeAttribute("data-theme");
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.style.colorScheme = isDark ? "dark" : "light";
    } else {
      root.setAttribute("data-theme", nextTheme);
      root.style.colorScheme = nextTheme;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const options: ThemePreference[] = ["system", "light", "dark"];
    const currentIndex = options.indexOf(theme);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = options[(currentIndex + 1) % options.length];
      handleSelect(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = options[(currentIndex - 1 + options.length) % options.length];
      handleSelect(prev);
    }
  };

  return (
    <div
      id={id}
      role="radiogroup"
      aria-label="Theme preference"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px",
        backgroundColor: "var(--sunken)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-control)",
        userSelect: "none",
      }}
    >
      {(["system", "light", "dark"] as ThemePreference[]).map((opt) => {
        const isSelected = mounted && theme === opt;
        const labelText = opt.charAt(0).toUpperCase() + opt.slice(1);

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(opt)}
            tabIndex={-1}
            style={{
              padding: "4px 10px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? "var(--text)" : "var(--muted)",
              backgroundColor: isSelected ? "var(--surface)" : "transparent",
              border: isSelected ? "1px solid var(--line)" : "1px solid transparent",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)",
            }}
          >
            {labelText}
          </button>
        );
      })}
    </div>
  );
}
