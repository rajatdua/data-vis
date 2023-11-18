import Image from 'next/image'
import React from "react";

interface ICustomButtonProps {
    title?: string;
    className?: string;
    icon: string;
    handleClick?: (e: React.MouseEvent<HTMLElement>) => void;
    style?: object;
}
const CustomButton: React.FC<ICustomButtonProps> = ({ className, icon, style, title, handleClick }) => {
    return (
        <button
            style={style}
            onClick={handleClick}
            className={`inline-flex items-center w-full px-6 py-3 text-sm font-medium leading-4 text-white bg-indigo-600 md:px-3 md:w-auto md:rounded-full lg:px-5 hover:bg-indigo-500 focus:outline-none md:focus:ring-2 focus:ring-0 focus:ring-offset-2 focus:ring-indigo-600 ${className}`}
        >
            <Image
                src={icon}
                width={24}
                height={24}
                alt={icon}
                className="pr-1"
            />
            {title}
        </button>
    );
};

export default CustomButton;