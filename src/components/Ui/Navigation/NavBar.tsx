"use client";
import React from "react";
import Button from "../Buttons/Button";
import NavLink from "./NavLink";

function NavBar() {
  return (
    <div className=" w-full h-16 bg-primaryDark flex items-center justify-between px-20">
      {/* Right */}
      <div>
        <NavLink
          label="SWAP"
          onClick={() => console.log("button clicked")}
        ></NavLink>
      </div>
      {/* Left */}
      <div>
        <Button
          label="CONNECT WALLET"
          onClick={() => console.log("button clicked")}
        ></Button>
      </div>
    </div>
  );
}

export default NavBar;
