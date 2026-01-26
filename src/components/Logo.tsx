import React from "react";
import logoImg from "../assets/images/logos/EO_globe_vert_teal_transparent.webp";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps): React.JSX.Element {
  const sizeClasses = {
    sm: "w-16 h-auto",
    md: "w-20 h-auto",
    lg: "w-32 h-auto"
  };

  return (
    <img
      src={logoImg}
      alt="EndsideOut Logo"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}
