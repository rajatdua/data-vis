import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import WordCloud from "../../components/WordCloud/WordCloud";
import WordCloudV2 from "../../components/WordCloud/WordCloudV2";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import {ICommonChartProps, ID3Object, IFetchWordData, IFetchWordReq, IInterimWordData} from "../../types";
import {createDateQuery} from "../../utils/client";

const WordCloudContainer: React.FC<ICommonChartProps>  = ({ date, refreshCount, version2 }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isLoading, setLoading] = useState(true);
    const [wordCloudData, setWordCloud] = useState<IFetchWordData[]>([]);
    const [selectedWord, setWord] = useState<IFetchWordData|null>(null);
    const [isMenuOpen, setMenu] = useState(false);
    const [isSidebar, setSidebar] = useState(false);


    useEffect(() => {
        // Add click event listener to close sidebar when clicked outside
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                if (isSidebar) setSidebar(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    useEffect(() => {
        const fetchWordCloud = async () => {
            const query = createDateQuery(date, '/api/word-cloud');
            const fetchedData = await (await fetch(query)).json() as IFetchWordReq;
            const wordList = fetchedData?.data ?? [];
            setWordCloud(wordList);
            setLoading(false);
        };
        fetchWordCloud();
    }, [refreshCount]);

    useEffect(() => {
        if (isSidebar) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto"
    }, [isSidebar]);

    const handleWordClick = (d3Object: ID3Object) => {
        const selectedWord = wordCloudData.filter(word => word.text === d3Object.text);
        setMenu(true);
        setWord(selectedWord[0]);
    };

    const handleWordClickV2 = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        const innerHTML = target.innerHTML;

        const selectedWord = wordCloudData.filter(word => word.text === innerHTML);
        setMenu(true);
        setWord(selectedWord[0]);
    }

    if (isLoading) return <div className="flex justify-center" style={{ height: '600px' }}><Spinner /></div>
    const updated: IInterimWordData[] = wordCloudData.map(item => ({
        text: item.text,
        value: item.textMeta.count
    }));
    return (
      <div>
          <div className="relative">
              {!version2 && <WordCloud data={wordCloudData} handleWordClick={handleWordClick} />}
              {version2 &&  <ParentSize>{({ width }: { width: number }) => <WordCloudV2 words={updated} width={width} handleWordClick={handleWordClickV2} />}</ParentSize>}
              {/* Popup menu */}
              {isMenuOpen && (
                <div className="origin-top-right top-0 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => { /* filter on the basis {selectedWord} */ setMenu(false); }}
                        >
                            Select
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => { setMenu(false); setSidebar(true); }}
                        >
                            View Tweets
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => { setWord(null); setMenu(false); }}
                        >
                            Close
                        </a>
                    </div>
                </div>
              )}
          </div>
          {isSidebar && (
            <div
              ref={sidebarRef}
              className={`drop-shadow-md fixed top-0 right-0 text-left z-20 h-full bg-gray-200 text-white w-${isSidebar ? '1/2' : '0'} overflow-x-hidden transition-all duration-300 overflow-y-scroll`}
            >
                <div className="sticky top-0 z-10 bg-black p-4">
                    <div className="flex justify-between items-center p-4">
                        <div className="text-lg font-bold">Some Tweets for &quot;{selectedWord?.text}&quot;</div>
                        <button onClick={() => { setSidebar(false); setWord(null); }} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:border-blue-300">
                            <Image src="/close-icon.svg" width={24} height={24} alt="close" />
                        </button>
                    </div>
                </div>
                <ul className="px-4">
                    {selectedWord?.textMeta.tweets.map((tweet, index) => {
                        const replacedWithWord = tweet.replaceAll(selectedWord?.text, `<span class="font-bold">${selectedWord?.text}</span>`);
                        return (
                          <li key={index}>
                              {/*<p className="text-black">{tweet}</p>*/}
                              <div className="flex flex-row bg-white p-4 rounded-xl shadow-md m-5">
                                  <Image width={42} height={42} className="h-12 w-12 rounded-full object-cover" src="/donald-trump.png" alt="Profile picture" />
                                  <div className="ml-4">
                                      <div className="flex items-center">
                                          <span className="font-bold text-gray-800 text-lg">Donald J. Trump</span>
                                          <span className="text-gray-500 text-sm">&nbsp;@realDonaldTrump</span>
                                          {/*<span className="text-gray-500 ml-2 text-sm">Jun 27</span>*/}
                                      </div>
                                      <p className="mt-2 text-gray-800" dangerouslySetInnerHTML={{ __html: replacedWithWord }}/>
                                  </div>
                              </div>
                          </li>
                        );
                    })}
                </ul>
            </div>
          )}
      </div>
    );
}

export default WordCloudContainer;