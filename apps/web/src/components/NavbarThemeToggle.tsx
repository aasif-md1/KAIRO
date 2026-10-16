"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { ThemePreference } from "./AppearanceControl";

export function NavbarThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("kairo-theme") as ThemePreference | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setTheme(stored);
    }
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    localStorage.setItem("kairo-theme", nextTheme);
    setOpen(false);

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

  const getActiveIcon = () => {
    if (!mounted || theme === "system") {
      return <Monitor size={16} strokeWidth={1.75} aria-hidden="true" />;
    }
    if (theme === "dark") {
      return <Moon size={16} strokeWidth={1.75} aria-hidden="true" />;
    }
    return <Sun size={16} strokeWidth={1.75} aria-hidden="true" />;
  };

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        id="navbar-theme-toggle-btn"
        aria-label={`Theme: ${theme}. Click to change.`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "34px",
          height: "34px",
          borderRadius: "var(--radius-control)",
          backgroundColor: open ? "var(--sunken)" : "transparent",
          border: "1px solid " + (open ? "var(--line)" : "transparent"),
          color: "var(--text-2)",
          cursor: "pointer",
          transition: "background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--sunken)";
          e.currentTarget.style.color = "var(--text)";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-2)";
          }
        }}
      >
        {getActiveIcon()}
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="navbar-theme-toggle-btn"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: "148px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-control)",
            padding: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect("light")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              fontSize: "13px",
              fontFamily: "var(--font-sans)",
              borderRadius: "2px",
              border: "none",
              backgroundColor: theme === "light" ? "var(--sunken)" : "transparent",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sun size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>Light</span>
            </div>
            {theme === "light" && <Check size={14} color="var(--accent-text)" aria-hidden="true" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect("dark")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              fontSize: "13px",
              fontFamily: "var(--font-sans)",
              borderRadius: "2px",
              border: "none",
              backgroundColor: theme === "dark" ? "var(--sunken)" : "transparent",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Moon size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <Check size={14} color="var(--accent-text)" aria-hidden="true" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect("system")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              fontSize: "13px",
              fontFamily: "var(--font-sans)",
              borderRadius: "2px",
              border: "none",
              backgroundColor: theme === "system" ? "var(--sunken)" : "transparent",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Monitor size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>System</span>
            </div>
            {theme === "system" && <Check size={14} color="var(--accent-text)" aria-hidden="true" />}
          </button>
        </div>
      )}
    </div>
  );
}
