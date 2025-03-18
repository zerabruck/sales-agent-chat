import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import React from "react";
import Loader from "./ui/Loader";

const AssistantLoader = () => {
  return (
    <div className={`flex gap-3 mb-52`}>
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#212124]`}
      >
        <ComputerDesktopIcon className="h-5 w-5 text-[#A64D79]" />
      </div>
      <div className={`flex flex-col gap-2 max-w-[80%] items-start`}>
        <Loader />
      </div>
    </div>
  );
};

export default AssistantLoader;
