import React from "react";

interface IPopupProps {
  options: { label: string, clickEvent: () => void }[]
}

const Popup: React.FC<IPopupProps> = ({ options = [] }) => {
  return (
    <div className="origin-top-right top-0 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">
        {options.map(opt => {
          return (
            <a
              key={opt.label}
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => { /* filter on the basis {selectedWord} */ opt.clickEvent() }}
            >
              {opt.label}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Popup;