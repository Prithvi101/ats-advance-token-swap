import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { RxCross1 } from "react-icons/rx";

interface MultiAlertProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  label?: string;
  children: ReactNode;
}
function MultiAlert({ show, setShow, label, children }: MultiAlertProps) {
  return show ? (
    <div className="fixed top-0 left-0  z-50 w-full h-full bg-black bg-opacity-70 flex items-center justify-center animate-fadeIn">
      <div className="bg-select rounded-3xl  w-full pb-2 overflow-hidden max-w-80 text-white animate-modalOpen border-white/10 border-2">
        <div className="flex justify-between items-center mb-4 px-6 pt-6">
          <h3 className="text-xl font-bold ">{label ? label : ""}</h3>
          {/* Close Button */}
          <div className="cursor-pointer" onClick={() => setShow(false)}>
            <RxCross1 />
          </div>
        </div>
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default MultiAlert;
