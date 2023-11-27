import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, { useEffect, useRef, useState } from "react";
import Popup from "../../components/Popup/Popup";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import Tweet from "../../components/Tweet/Tweet";
import WordCloud from "../../components/WordCloud/WordCloud";
import WordCloudV2 from "../../components/WordCloud/WordCloudV2";
import {ICommonChartProps, ID3Object, IFetchWordData, IFetchWordReq, IInterimWordData} from "../../types";
import {createDateQuery} from "../../utils/client";

const WordCloudContainer: React.FC<ICommonChartProps>  = ({ date, refreshCount, version2, setRefreshing }) => {
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
    const options = [
        { label: 'Select', clickEvent: () => setMenu(false) },
        { label: 'View Tweets', clickEvent: () => {
                setMenu(false);
                setSidebar(true);
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
            }} title={`Some Tweets for "${selectedWord?.text}"`}>
                {sidebarChildren()}
            </Sidebar>
          )}
      </div>
    );
}

export default WordCloudContainer;