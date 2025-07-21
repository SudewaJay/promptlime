"use client";

import { cn } from "@/lib/utils";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  fill?: string;
}

export function Spotlight({ className, fill = "#fff" }: SpotlightProps) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full z-10 pointer-events-none",
        className
      )}
    >
      <svg className="w-full h-full">
        <defs>
          <radialGradient id="spotlight-gradient" r="50%" cx="50%" cy="50%">
            <stop offset="0%" stopColor={fill} stopOpacity="0.3" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#spotlight-gradient)" />
      </svg>
    </div>
  );
}