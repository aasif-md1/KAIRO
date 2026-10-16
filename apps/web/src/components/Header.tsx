"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { BrandLogo } from "./BrandLogo";
import { NavbarThemeToggle } from "./NavbarThemeToggle";
import { AppearanceControl } from "./AppearanceControl";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  user?: {
    login: string;
    avatar_url?: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle focus trap and escape key in mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      } else if (e.key === "Tab" && menuRef.current) {
        const focusables = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus first element in menu
    const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/how-it-works", label: "How it works" },
    { href: "/coverage", label: "Coverage" },
    { href: "/security", label: "Security" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--bg)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "border-color var(--dur-fast) var(--ease)",
      }}
    >
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo Lockup */}
        <Link
          href="/"
          aria-label="KAIRO Home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <BrandLogo variant="navbar" height={28} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: isActive ? "var(--text)" : "var(--muted)",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: "none",
                  position: "relative",
                  padding: "8px 0",
                  transition: "color var(--dur-fast) var(--ease)",
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "var(--accent)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions (Desktop) */}
        <div
          className="desktop-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <NavbarThemeToggle />

          {user ? (
            <Link
              href="/projects"
              className="btn btn-primary"
              style={{ fontSize: "14px", padding: "6px 14px", textDecoration: "none" }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-2)",
                  textDecoration: "none",
                  padding: "6px 10px",
                  borderRadius: "var(--radius-control)",
                  transition: "color var(--dur-fast) var(--ease)",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-in"
                className="btn btn-primary"
                style={{
                  fontSize: "14px",
                  padding: "7px 16px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {/* GitHub Mark SVG */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <span>Continue with GitHub</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger Button */}
        <button
          ref={menuButtonRef}
          type="button"
          className="mobile-menu-btn"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            alignItems: "center",
            gap: "6px",
            padding: "6px 10px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-control)",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: "var(--font-sans)",
          }}
        >
          {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          <span>Menu</span>
        </button>
      </Container>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          style={{
            position: "fixed",
            top: "72px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "var(--bg)",
            borderTop: "1px solid var(--line)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            zIndex: 49,
            overflowY: "auto",
          }}
        >
          <nav aria-label="Mobile Navigation" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    color: isActive ? "var(--text)" : "var(--muted)",
                    fontSize: "18px",
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: "none",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                Theme
              </span>
              <AppearanceControl id="mobile-appearance-control" />
            </div>

            <Link
              href="/sign-in"
              className="btn btn-secondary"
              style={{
                width: "100%",
                padding: "10px",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>

            <Link
              href="/sign-in"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Continue with GitHub</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
