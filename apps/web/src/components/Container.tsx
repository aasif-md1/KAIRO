import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
  id?: string;
}

export function Container({
  children,
  className = "",
  style,
  as: Component = "div",
  id,
}: ContainerProps) {
  return (
    <Component
      id={id}
      className={`container ${className}`.trim()}
      style={style}
    >
      {children}
    </Component>
  );
}
