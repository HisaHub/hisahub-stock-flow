
import React from "react";

const Logo: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <div
    className="flex items-center select-none cursor-pointer"
    style={{ minWidth: size, minHeight: size }}
    title="HisaHub"
  >
    <div className="rounded-full bg-secondary flex items-center justify-center" style={{ width: size, height: size }}>
      <span
        className="font-bold text-primary text-3xl animate-logo-float transition-transform duration-400"
        style={{
          fontFamily: "'Poppins', sans-serif",
          color: "#000080",
        }}
      >
        H
      </span>
    </div>
  </div>
);

export default Logo;
