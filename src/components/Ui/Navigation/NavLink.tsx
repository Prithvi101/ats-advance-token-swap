import Link from "next/link";
import React from "react";

function NavLink({
  label,
  onClick,
  link,
}: {
  label: string;
  onClick: () => void;
  link: string;
}) {
  return (
    <Link href={link}>
      <div
        onClick={onClick}
        className=" text-primaryLight font-mono font-bold  sm:text-lg hover:text-primary rounded-full px-4 py-2  flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform ease-in-out duration-100"
      >
        {label}
      </div>
    </Link>
  );
}

export default NavLink;
