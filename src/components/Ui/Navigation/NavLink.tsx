import React from "react";

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className=" text-primaryLight font-mono font-bold text-lg rounded-full px-4 py-2  flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform ease-in-out duration-100"
    >
      {label}
    </div>
  );
}

export default NavLink;
