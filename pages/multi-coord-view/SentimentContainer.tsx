import ParentSize from '@visx/responsive/lib/components/ParentSize';
import {saveAs} from "file-saver";
import React, {MouseEvent, useEffect, useState} from "react";
import ColumnChart from "../../components/ColumnChart/ColumnChart";
import Popup from "../../components/Popup/Popup";
import Select from "../../components/Select/Select";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import Tweet from "../../components/Tweet/Tweet";
import {INIT_SENTIMENT} from "../../constants";
import {useAppStore} from "../../store/app";
import {
  ICommonChartProps, IExportReq,
  IFetchSentimentData,
  IFetchSentimentReq,
  IFetchTweetData,
  IFetchTweetReq,
  SentimentItem
} from "../../types";
import {createDashboard, createDateQuery, fetchFloatingType} from "../../utils/client";

export function convertToSentimentArray(sentimentCounts: IFetchSentimentData, selectedScale: string): SentimentItem[] {
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

const SentimentContainer: React.FC<ICommonChartProps> = ({ date, refreshCount, setRefreshing, setTotalTweets, recursive = { ids: [], graphKey: '' } }) => {
  const { setGraphToRender, setTweetIds, setTitle, setDashboard } = useAppStore();

  const [sentimentData, setSentimentData] = useState<IFetchSentimentData>(INIT_SENTIMENT);
  const [isLoadingTweets, setLoadingTweets] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [fetchedTweets, setFetchedTweets] = useState<IFetchTweetData[]>([])
  const [selectedScale, setScale] = useState<'name' | 'value'>('value');
  const [isMenuOpen, setMenu] = useState(false);
  const [tweetsToView, setTweets] = useState<string[]>([]);
  const [selectedType, setType] = useState('');
  const [isSidebar, setSidebar] = useState(false);
  const [isExporting, setExportLoader] = useState(false);

  const { ids, graphKey } = recursive;

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
    if (ids.length === 0) fetchPollData();
  }, [refreshCount]);

  useEffect(() => {
    if (ids.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - TODO: I NEED TO USE setData as COMMON METHOD; LONG WAY IS USING TYPESCRIPT TEMPLATES I DON'T HAVE TIME FOR THIS
      fetchFloatingType({ date, ids, graphKey }, { setData: setSentimentData, setLoading });
    }
  }, [ids]);

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
    setType(selectedEntry.group)
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
    { label: 'Export Tweets', clickEvent: async () => {
        setMenu(false);
        setExportLoader(true);
        try {
          const res = await (await fetch('/api/export?type=sentiment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: tweetsToView, meta: { type: selectedType } })
          })).json() as IExportReq;
          const blob = new Blob([res.data], { type: 'text/csv' });
          saveAs(blob, res.fileName);
        } catch (err) {
          console.error(err);
        }
        setExportLoader(false);
        setType('');
        setTweets([]);
      } },
    { label: 'Explore', clickEvent: () => {
        createDashboard(
          tweetsToView,
          { 'word-cloud': true, 'tweet-time-map': true, 'top-interacted': true },
          { date, container: 'Sentiment' },
          { setGraphToRender, setTweetIds, setTitle, setDashboard }
        );
        setMenu(false);
      } },
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
      {isExporting && (<div className='fixed inset-0 bg-gray-400 pointer-events-none opacity-60 flex justify-center'><Spinner/></div>)}
      </div>
    );
  }
};

export default SentimentContainer;