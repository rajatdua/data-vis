import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, {MouseEvent, useEffect, useState} from "react";
import ColumnChart from "../../components/ColumnChart/ColumnChart";
import Popup from "../../components/Popup/Popup";
import Select from "../../components/Select/Select";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import Tweet from "../../components/Tweet/Tweet";
import {INIT_SENTIMENT} from "../../constants";
import {
  ICommonChartProps,
  IFetchSentimentData,
  IFetchSentimentReq,
  IFetchTweetData,
  IFetchTweetReq,
  SentimentItem
} from "../../types";
import {createDateQuery} from "../../utils/client";

function convertToSentimentArray(sentimentCounts: IFetchSentimentData, selectedScale: string): SentimentItem[] {
  const sentimentArray: SentimentItem[] = Object.entries(sentimentCounts).map(([group, value]) => ({
    group,
    value,
  }));

  if (selectedScale === 'name')
  // Sort the array based on the "group" property
    sentimentArray.sort((a, b) => a.group.localeCompare(b.group));
  else if (selectedScale === 'value')
    sentimentArray.sort((a, b) => b.value.count - a.value.count);
  // else if (selectedScale === 'semantics') {
  //   const order = ['negative', 'neutral', 'positive'];
  //   sentimentArray.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
  // }
  return sentimentArray;
}

const scaleOptions = [{value: 'name', label: 'Sort by Name'}, {value: 'value', label: 'Sort by Value'}];

const SentimentContainer: React.FC<ICommonChartProps> = ({ date, refreshCount, setRefreshing, setTotalTweets }) => {
  const [sentimentData, setSentimentData] = useState<IFetchSentimentData>(INIT_SENTIMENT);
  const [isLoadingTweets, setLoadingTweets] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [fetchedTweets, setFetchedTweets] = useState<IFetchTweetData[]>([])
  const [selectedScale, setScale] = useState<'name' | 'value'>('value');
  const [isMenuOpen, setMenu] = useState(false);
  const [tweetsToView, setTweets] = useState<string[]>([]);
  const [isSidebar, setSidebar] = useState(false);

  useEffect(() => {
    const fetchPollData = async () => {
      setRefreshing(true);
      const query = createDateQuery(date, '/api/sentiment');
      const result = await (await fetch(query)).json() as IFetchSentimentReq;
      const safeResult = result.data ?? INIT_SENTIMENT;
      setSentimentData(safeResult);
      let totalSum = 0;
      Object.values(safeResult).forEach(value => totalSum+=value.count);
      setTotalTweets && setTotalTweets(totalSum);
      setLoading(false);
    };
    fetchPollData();
  }, [refreshCount]);

  const handleChartRender = () => {
    setRefreshing(false);
  };

  const handleChange = (selectedScale: string) => {
    if (selectedScale === 'name' || selectedScale === 'value')
      setScale(selectedScale)
    else throw Error(`Wrong scale selected: ${selectedScale}`)
  };

  const handleColumnClick = (_: MouseEvent, selectedEntry: SentimentItem) => {
    setMenu(true);
    setTweets(selectedEntry.value.tweets);
  };

  const options = [
    {
      label: 'View Tweets', clickEvent: async () => {
        setMenu(false);
        setSidebar(true);
        const fetchedData = await (await fetch('/api/tweets', {
          method: 'POST',
          body: JSON.stringify({ids: tweetsToView})
        })).json() as IFetchTweetReq;
        setFetchedTweets(fetchedData.data ?? []);
        setLoadingTweets(false);
      }
    },
    {
      label: 'Close', clickEvent: () => {
        setMenu(false);
      }
    },
  ];

  const sidebarChildren = () => {
    return fetchedTweets.map((tweet, index) => {
      return (
        <li key={index}>
          <Tweet tweetHTML={tweet.content}/>
        </li>
      );
    })
  };

  // TODO: Give ability to select bars and show pop-up menu for export
  if (isLoading) return <div className="flex flex-col justify-center" style={{ height: '420px' }}><Spinner /></div>
  else {
    return (
      <div>
      <div className="flex justify-end">
        <Select handleChange={handleChange} options={scaleOptions} preSelected={selectedScale}/>
      </div>
      <ParentSize>{({ width }: { width: number }) => <ColumnChart handleColumnClick={handleColumnClick} width={width} data={convertToSentimentArray(sentimentData, selectedScale)} onChartRender={handleChartRender} />}</ParentSize>
      {isMenuOpen && (
        <Popup options={options}/>
      )}
      {isSidebar && (
        <Sidebar isSidebar={isSidebar} onClose={() => {
          setSidebar(false);
          setLoadingTweets(true);
          setTweets([]);
          setFetchedTweets([]);
        }} title={`Tweets for selected data points ${isLoadingTweets ? '...' : `(${fetchedTweets.length})`}`}>
          {isLoadingTweets ? <div className='pt-48'><Spinner/></div> : sidebarChildren()}
        </Sidebar>
      )}
      </div>
    );
  }
};

export default SentimentContainer;