import React from "react";
import Spinner from "../Spinner/Spinner";

interface IChartOverlayProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const ChartOverlay: React.FC<IChartOverlayProps> = ({ children, isLoading }) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center z-50">
          <div className="bg-gradient-radial opacity-30 w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default ChartOverlay;
