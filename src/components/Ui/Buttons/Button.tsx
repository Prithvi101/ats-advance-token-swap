import React from "react";
import { FaArrowRight } from "react-icons/fa";

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-primary text-primaryDark rounded-full px-4 py-2  flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform ease-in-out duration-100"
    >
      {label}
      <FaArrowRight />
    </div>
  );
}

export default Button;
