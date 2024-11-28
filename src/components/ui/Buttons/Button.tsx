"use client";
import React from "react";
import { IconType } from "react-icons";

function Button({
  label,
  onClick,
  Icon,
  className,
}: {
  label: string;
  onClick: () => void;
  Icon?: IconType;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={
        "bg-primary text-primaryDark rounded-full px-4 py-2  flex items-center gap-3 cursor-pointer  transition-transform ease-in-out duration-100 " +
        className
      }
    >
      {label}
      {Icon && <Icon />}
    </div>
  );
}

export default Button;
