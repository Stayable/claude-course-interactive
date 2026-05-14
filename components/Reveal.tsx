"use client";

import { Children, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  stepMs?: number;
  startMs?: number;
  as?: "div" | "section" | "ul" | "ol";
}

export function Reveal({
  children,
  stepMs = 90,
  startMs = 0,
  as: Tag = "div",
}: RevealProps) {
  const items = Children.toArray(children);
  return (
    <Tag>
      {items.map((child, i) => (
        <span
          key={i}
          className="reveal-item inline-block"
          style={{ animationDelay: `${startMs + i * stepMs}ms` }}
        >
          {child}
        </span>
      ))}
    </Tag>
  );
}
