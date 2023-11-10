import React, { useEffect, useState, useRef } from "react";
import WordCloud from "../../components/WordCloud/WordCloud";
import {ICommonChartProps, ID3Object, IFetchWordData, IFetchWordReq} from "../../types";
import {createDateQuery} from "../../utils/client";

const WordCloudContainer: React.FC<ICommonChartProps>  = ({ date, refreshCount }) => {
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
    }, []); // Empty dependency array ensures the effect runs only once on mount



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

    const handleWordClick = (_: PointerEvent, d3Object: ID3Object) => {
        const selectedWord = wordCloudData.filter(word => word.text === d3Object.text);
        setMenu(true);
        setWord(selectedWord[0]);
    };

    if (isLoading) return <div>Loading...</div>
    return (
        <div>
            <div className="grid grid-cols-4 gap-16">
                <div className="relative">
                    <WordCloud data={wordCloudData} handleWordClick={handleWordClick} />
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
                        className={`fixed top-0 right-0 text-left h-full bg-gray-800 text-white w-${isSidebar ? '1/2' : '0'} overflow-x-hidden transition-all duration-300`}
                    >
                        <div className="sticky top-0 z-10 bg-gray-800 p-4">
                        <div className="flex justify-between items-center p-4">
                            <div className="text-lg font-bold">All Tweets for {selectedWord?.text}</div>
                            <button onClick={() => { setSidebar(false); setWord(null); }} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:border-blue-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.293 7.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 011.414 1.414l-2.293 2.293 2.293 2.293a1 1 0 01-1.414 1.414L10 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 12 6.293 9.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                        </div>

                        <ul className="px-4">
                            {selectedWord?.textMeta.tweets.map((tweet, index) => (
                                <li key={index} className={`mb-2 ${index < selectedWord?.textMeta.tweets.length - 1 ? 'border-b border-gray-600' : ''}`}>
                                    <p className="text-gray-300">{tweet}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WordCloudContainer;