
import React from "react";
import logoImage from "@/assets/dimkoff-logo.png";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <img
      src={logoImage}
      alt="Dimkoff"
      className={className}
    />
  );
};
