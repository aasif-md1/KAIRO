import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  user?: {
    login: string;
    avatar_url?: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--line)",
        backgroundColor: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Brand Lockup */}
        <Link
          href={user ? "/projects" : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
          aria-label="KAIRO Home"
        >
          <img
            src="/navbar-logo-dark.png"
            alt="KAIRO"
            className="brand-dark"
            style={{ height: "30px", width: "auto" }}
          />
          <img
            src="/navbar-logo-light.png"
            alt="KAIRO"
            className="brand-light"
            style={{ height: "30px", width: "auto" }}
          />
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {user ? (
            <>
              <Link
                href="/projects"
                style={{
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Projects
              </Link>
              <Link
                href="/account"
                style={{
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {user.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    width={24}
                    height={24}
                    style={{ borderRadius: "50%" }}
                  />
                )}
                <span>{user.login}</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/security"
                style={{
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Security
              </Link>
              <Link
                href="/sign-in"
                className="btn btn-primary"
                style={{ textDecoration: "none" }}
              >
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
