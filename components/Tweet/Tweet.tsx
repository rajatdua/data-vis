import Image from "next/image";
import React from "react";

interface ITweetProps {
  tweetHTML: string
}
const Tweet: React.FC<ITweetProps> = ({ tweetHTML = '' }) => {
  return (
    <div className="flex flex-row bg-white p-4 rounded-xl shadow-md m-5">
      <Image width={42} height={42} className="h-12 w-12 rounded-full object-cover" src="/donald-trump.png" alt="Profile picture" />
      <div className="ml-4">
        <div className="flex items-center">
          <span className="font-bold text-gray-800 text-lg">Donald J. Trump</span>
          <span className="text-gray-500 text-sm">&nbsp;@realDonaldTrump</span>
          {/*<span className="text-gray-500 ml-2 text-sm">Jun 27</span>*/}
        </div>
        <p className="mt-2 text-gray-800" style={{ overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: tweetHTML }}/>
      </div>
    </div>
  );
};

export default Tweet;