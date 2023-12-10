import Image from "next/image";
import React from "react";

interface IPopupProps {
  options: { label: string, clickEvent: () => void, icon?: string }[]
}

const Popup: React.FC<IPopupProps> = ({ options = [] }) => {
  return (
    <div className="origin-top-right top-0 absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="py-1 flex flex-col items-start">
        {options.map(opt => {
          return (
            <a
              key={opt.label}
              href="#"
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex flex-row w-full"
              onClick={() => { /* filter on the basis {selectedWord} */ opt.clickEvent() }}
            >
              {opt.icon && <Image src={opt.icon} alt={opt.icon} width={24} height={24} className='mr-2' />}
              {opt.label}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Popup;