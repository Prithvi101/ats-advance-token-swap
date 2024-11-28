"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaSearch } from "react-icons/fa";

function SearchInput({
  searchQuery,
  setSearchQuery,
  onClick,
}: {
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-full text-xl px-4 py-4 mb-4 rounded-full bg-deselect text-white border-none flex items-center gap-2"
    >
      <FaSearch className="text-white/25"></FaSearch>
      <input
        type="text"
        className="bg-transparent outline-none"
        placeholder="Search token..."
        value={searchQuery}
        onChange={(e) => setSearchQuery?.(e.target.value)}
      />
    </div>
  );
}

export default SearchInput;
