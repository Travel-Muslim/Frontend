import React from "react";
declare const require: any;

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

export default function Icon({ name, size = 24, className = "", alt = "" }: IconProps) {
  let src: string | null = null;

  try {
    src = require(`../assets/icon/${name}.svg`);
  } catch {
    try {
      src = require(`../assets/icon/${name}.png`);
    } catch {
      src = null;
    }
  }

  if (!src) {
    return (
      <span
        className={className}
        style={{ width: size, height: size, display: "inline-block" }}
      />
    );
  }

  return <img src={src} width={size} height={size} className={className} alt={alt || name} />;
}
 
