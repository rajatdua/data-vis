import Image from "next/image";
import React from "react";

interface ISidebarProps {
  sidebarRef?: React.Ref<HTMLDivElement>
  isSidebar: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

const Sidebar: React.FC<ISidebarProps> = ({ sidebarRef, isSidebar, title, onClose, children }) => {
  return (
    <div
      ref={sidebarRef}
      className={`drop-shadow-md fixed top-0 right-0 text-left z-20 h-full bg-gray-200 text-white w-${isSidebar ? '1/2' : '0'} overflow-x-hidden transition-all duration-300 overflow-y-scroll`}
    >
      <div className="sticky top-0 z-10 bg-black p-4">
        <div className="flex justify-between items-center p-4">
          <div className="text-lg font-bold">{title}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:border-blue-300">
            <Image src="/close-icon.svg" width={24} height={24} alt="close" />
          </button>
        </div>
      </div>
      <ul className="px-4">
        {children}
      </ul>
    </div>
  );
};

export default Sidebar