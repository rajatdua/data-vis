import Image from "next/image";
import React, { useState } from 'react';

interface IInfoProps {
  handleClick: () => void;
}

const InfoButton: React.FC<IInfoProps> = ({ handleClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button
        className="text-blue-500 hover:underline hover:text-blue-700 focus:outline-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <Image src='/info-icon.svg' alt='info' width={24} height={24} />
      </button>
      {isHovered && (
        <div className="absolute z-50 w-48 p-2 -top-2 left-7 text-sm bg-white border border-gray-300 rounded-md shadow-md font-light">
          Learn More
        </div>
      )}
    </div>
  );
};

export default InfoButton;
