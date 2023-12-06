import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from "react";
import Popup from "../../components/Popup/Popup";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import Tweet from "../../components/Tweet/Tweet";
import WordCloud from "../../components/WordCloud/WordCloud";
import WordCloudV2 from "../../components/WordCloud/WordCloudV2";
import {ICommonChartProps, ID3Object, IExportReq, IFetchWordData, IFetchWordReq, IInterimWordData} from "../../types";
import {createDateQuery} from "../../utils/client";

const WordCloudContainer: React.FC<ICommonChartProps>  = ({ date, refreshCount, version2, setRefreshing }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isLoading, setLoading] = useState(true);
    const [isExporting, setExportLoader] = useState(false);
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
            setRefreshing(true);
            const query = createDateQuery(date, '/api/word-cloud', '&version=2');
            const fetchedData = await (await fetch(query)).json() as IFetchWordReq;
            const wordList = fetchedData?.data ?? [];
            setWordCloud(wordList);
            setRefreshing(false);
            setLoading(false);
        };
        fetchWordCloud();
    }, [refreshCount]);

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
    const options = [
        { label: 'Select', clickEvent: () => setMenu(false) },
        { label: 'View Tweets', clickEvent: () => {
                setMenu(false);
                setSidebar(true);
            } },
        { label: 'Export Tweets', clickEvent: async () => {
                setMenu(false);
                setExportLoader(true);
                try {
                    const res = await (await fetch('/api/export?type=word-cloud', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ content: selectedWord?.textMeta.ids, meta: { word: selectedWord?.text, count: selectedWord?.textMeta.count } })
                    })).json() as IExportReq;
                    const blob = new Blob([res.data], { type: 'text/csv' });
                    saveAs(blob, res.fileName);
                } catch (err) {
                    console.error(err);
                }
                setExportLoader(false);
                setWord(null);
            } },
        { label: 'Close', clickEvent: () => {
                setWord(null);
                setMenu(false);
            }
        },
    ];
    const sidebarChildren = () => {
        return selectedWord?.textMeta.tweets.map((tweet, index) => {
            const replacedWithWord = tweet.replaceAll(selectedWord?.text, `<span class="font-bold">${selectedWord?.text}</span>`);
            return (
              <li key={index}>
                  <Tweet tweetHTML={replacedWithWord} />
              </li>
            );
        })
    };

    const handleChartRender = () => {
        setRefreshing(false);
    };

    return (
      <div>
          <div className="relative">
              {!version2 && <WordCloud data={wordCloudData} handleWordClick={handleWordClick} onChartRender={handleChartRender} />}
              {version2 &&  <ParentSize>{({ width }: { width: number }) => <WordCloudV2 words={updated} width={width} handleWordClick={handleWordClickV2} />}</ParentSize>}
              {isMenuOpen && (
                <Popup options={options} />
              )}
          </div>
          {isSidebar && (
            <Sidebar isSidebar={isSidebar} sidebarRef={sidebarRef} onClose={() => {
                setSidebar(false); setWord(null);
            }} title={`Some Tweets for "${selectedWord?.text.substring(0,20)}..."`}>
                {sidebarChildren()}
            </Sidebar>
          )}
          {isExporting && (<div className='fixed inset-0 bg-gray-400 pointer-events-none opacity-60 flex justify-center'><Spinner/></div>)}
      </div>
    );
}

export default WordCloudContainer;