"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export default function Logo({ className = "", variant = "dark" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`} aria-label="Allied MFG Home">
      <div className="relative h-8 w-auto">
        {/* SVG fallback logo matching the uploaded brand mark */}
        <svg
          height="32"
          viewBox="0 0 340 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Allied MFG Pte Ltd"
        >
          <text
            x="0"
            y="46"
            fontFamily="'Inter', system-ui, sans-serif"
            fontWeight="800"
            fontSize="46"
            letterSpacing="-1"
            fill={variant === "light" ? "#FFFFFF" : "#111111"}
          >
            ALLIED MFG
          </text>
          <text
            x="0"
            y="60"
            fontFamily="'Inter', system-ui, sans-serif"
            fontWeight="500"
            fontSize="13"
            letterSpacing="2"
            fill={variant === "light" ? "rgba(255,255,255,0.7)" : "#6E6E73"}
          >
            PTE LTD
          </text>
        </svg>
      </div>
    </Link>
  );
}
