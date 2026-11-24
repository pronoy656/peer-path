"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getAvatarTintClass } from "@/lib/theme/tokens";
import type { Department } from "@/lib/types";

const SIZE_MAP = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "w-24 h-24 text-2xl",
};

export function Avatar({
  src,
  name,
  size = "md",
  department,
  avatarColor,
  className,
}: {
  src?: string;
  name: string;
  size?: keyof typeof SIZE_MAP;
  department?: Department | string;
  avatarColor?: string;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgFailed(true)}
        className={cn(
          "rounded-full object-cover border border-border shrink-0",
          SIZE_MAP[size],
          className
        )}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={cn(
        "rounded-full border flex items-center justify-center font-bold shrink-0 select-none",
        SIZE_MAP[size],
        getAvatarTintClass(avatarColor, department),
        className
      )}
    >
      {initials || "U"}
    </div>
  );
}
