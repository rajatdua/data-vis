import {saveAs} from "file-saver";
import React, {useEffect, useState} from "react";
import Popup from "../../components/Popup/Popup";
import ScatterPlot from "../../components/ScatterPlot/ScatterPlot";
import Select from "../../components/Select/Select";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import Tweet from "../../components/Tweet/Tweet";
import {useAppStore} from "../../store/app";
import {
  ICommonChartProps,
  IExportReq,
  IFetchTweetData,
  IFetchTweetMapData,
  IFetchTweetMapReq,
  IFetchTweetReq
} from "../../types";
import {createDashboard, createDateQuery, fetchFloatingType} from "../../utils/client";

const scaleOptions = [{value: 'log', label: 'Log Scale'}, {value: 'linear', label: 'Linear Scale'}];

const TweetPatternContainer: React.FC<ICommonChartProps> = ({date, refreshCount, setRefreshing, recursive = { ids: [], graphKey: '', prevDescription: '', depth: 0 }}) => {
  const { setGraphToRender, setTweetIds, setTitle, setDashboard } = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingTweets, setLoadingTweets] = useState(true);
  const [fetchedTweets, setFetchedTweets] = useState<IFetchTweetData[]>([])
  const [selectedDataPoints, setDataPoints] = useState<IFetchTweetMapData[]>([])
  const [isMenuOpen, setMenu] = useState(false);
  const [isSidebar, setSidebar] = useState(false);
  const [tweetMapData, setTweetMapData] = useState<IFetchTweetMapData[]>([])
  const [selectedScale, setScale] = useState<'log' | 'linear'>('log');
  const [isExporting, setExportLoader] = useState(false);

  const { ids, graphKey, prevDescription, depth } = recursive;

  useEffect(() => {
    const fetchTweetTimeMap = async () => {
      setRefreshing(true);
      const query = createDateQuery(date, '/api/tweet-time-map');
      const fetchedData = await (await fetch(query)).json() as IFetchTweetMapReq;
      setTweetMapData(fetchedData?.data ?? []);
      setLoading(false);
    };
    if (ids.length === 0) fetchTweetTimeMap();
  }, [refreshCount]);


  useEffect(() => {
    if (ids.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - TODO: I NEED TO USE setData as COMMON METHOD; LONG WAY IS USING TYPESCRIPT TEMPLATES I DON'T HAVE TIME FOR THIS
      fetchFloatingType({ date, ids, graphKey }, { setData: setTweetMapData, setLoading });
    }
  }, [ids]);

  if (isLoading) return <div className="flex justify-center" style={{height: '600px'}}><Spinner/></div>

  const handleChange = (selectedScale: string)  => {
    if (selectedScale === 'log' || selectedScale === 'linear')
      setScale(selectedScale)
    else throw Error(`Wrong scale selected: ${selectedScale}`)
  };

  const options = [
    { label: 'Export Tweets', icon: '/export-icon.svg', clickEvent: async () => {
        setMenu(false);
        setExportLoader(true);
        try {
          const allIds = selectedDataPoints.map(point => point.id);
          const res = await (await fetch('/api/export?type=tweet-time-map', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: allIds })
          })).json() as IExportReq;
          const blob = new Blob([res.data], { type: 'text/csv' });
          saveAs(blob, res.fileName);
        } catch (err) {
          console.error(err);
        }
        setDataPoints([]);
        setFetchedTweets([]);
        setExportLoader(false);
      } },
    {
      label: 'View Tweets', icon: '/view-b-icon.svg', clickEvent: async () => {
        setMenu(false);
        setSidebar(true);
        const allIds = selectedDataPoints.map(point => point.id);
        const fetchedData = await (await fetch('/api/tweets', {
          method: 'POST',
          body: JSON.stringify({ids: allIds})
        })).json() as IFetchTweetReq;
        setFetchedTweets(fetchedData.data ?? []);
        setLoadingTweets(false);
      }
    },
    { label: 'Explore', icon: '/explore-icon.svg', clickEvent: () => {
        const allIds = selectedDataPoints.map(point => point.id);
        createDashboard(
          allIds,
          { 'word-cloud': true, 'top-interacted': true, 'sentiment': true },
          { date, container: 'Tweet Time Map', depth, description: `Tweet Count: ${allIds.length}${prevDescription === '' ? '' : `<p><br/>${prevDescription}</p>`}` },
          { setGraphToRender, setTweetIds, setTitle, setDashboard }
        );
        setMenu(false);
      } },
    {
      label: 'Close', icon: '/close-b-icon.svg', clickEvent: () => {
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

  const handleBrush = (selectedPoints: IFetchTweetMapData[]) => {
    setDataPoints(selectedPoints);
    setMenu(true);
  };

  const handleChartRender = () => {
    setRefreshing(false);
  };

  return (
    <div>
      <div className="flex justify-end">
        <Select handleChange={handleChange} options={scaleOptions} preSelected={selectedScale}/>
      </div>
      <div className='relative'>
        {/*<ParentSize>{({ width }: { width: number }) => <ScatterPlot width={width} data={tweetMapData} scale={selectedScale} onBrush={handleBrush} onChartRender={handleChartRender}/>}</ParentSize>*/}
        <ScatterPlot data={tweetMapData} scale={selectedScale} onBrush={handleBrush} onChartRender={handleChartRender}/>
        {isMenuOpen && (
          <Popup options={options}/>
        )}
        {isSidebar && (
          <Sidebar isSidebar={isSidebar} onClose={() => {
            setSidebar(false);
            setLoadingTweets(true);
            setDataPoints([]);
            setFetchedTweets([]);
          }} title={`Tweets for selected data points ${isLoadingTweets ? '...' : `(${fetchedTweets.length})`}`}>
            {isLoadingTweets ? <div className='pt-48'><Spinner/></div> : sidebarChildren()}
          </Sidebar>
        )}
      </div>
      {isExporting && (<div className='fixed inset-0 bg-gray-400 pointer-events-none opacity-60 flex justify-center'><Spinner/></div>)}
    </div>
  );
};

export default TweetPatternContainer;