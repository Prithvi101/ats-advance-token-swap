"use client";
import React, { useEffect } from "react";
import Button from "../Buttons/Button";
import NavLink from "./NavLink";
import { FaArrowRight } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useWallet } from "@/hooks/useWallet";
import Image from "next/image";
import { MdToken } from "react-icons/md";

function NavBar() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  useEffect(() => {
    console.log(wallet);
  }, [wallet]);
  return (
    <div className=" w-full h-24 bg-primaryDark/50 flex items-center justify-between px-20">
      {/* Right */}
      <div className=" flex items-center justify-center sm:justify-start w-full">
        <MdToken className="text-4xl hover:text-primary cursor-pointer"></MdToken>
        <NavLink
          label="Swap"
          link="/"
          onClick={() => console.log("button clicked")}
        ></NavLink>
        <NavLink
          label="Explore"
          link="/explore"
          onClick={() => console.log("button clicked")}
        ></NavLink>
      </div>
      {/* Left */}
      <div className="w-[20%] flex justify-end">
        {wallet?.walletAddress ? (
          <div className="group relative flex items-center gap-2 font-bold  ">
            <Image
              src="/robot.png"
              alt="profile-icon"
              width={50}
              height={50}
              className="cursor-pointer w-auto h-8"
            />

            <div className="absolute top-full gap-2 -right-1/2 w-[180px] mx-auto group-hover:p-4 bg-select rounded-xl text-white overflow-hidden flex-col h-0 group-hover:h-32 transition-all group-hover:border-white/15 group-hover:border-2 duration-300 flex justify-center">
              <Button
                label="Account Details"
                onClick={() => {}}
                className="h-12 justify-center text-sm text-center"
              />
              <Button
                label="Logout"
                onClick={disconnectWallet}
                className="h-12 justify-center"
                Icon={IoLogOut}
              />
            </div>
          </div>
        ) : (
          <Button
            label={"CONNECT WALLET"}
            onClick={() => connectWallet()}
            Icon={FaArrowRight}
            className="text-sm"
          ></Button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
