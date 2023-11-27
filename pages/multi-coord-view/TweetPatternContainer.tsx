import React, {useEffect, useState} from "react";
import Popup from "../../components/Popup/Popup";
import ScatterPlot from "../../components/ScatterPlot/ScatterPlot";
import Select from "../../components/Select/Select";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import Tweet from "../../components/Tweet/Tweet";
import {ICommonChartProps, IFetchTweetData, IFetchTweetMapData, IFetchTweetMapReq, IFetchTweetReq} from "../../types";
import {createDateQuery} from "../../utils/client";

const scaleOptions = [{value: 'log', label: 'Log Scale'}, {value: 'linear', label: 'Linear Scale'}];

const TweetPatternContainer: React.FC<ICommonChartProps> = ({date, refreshCount, setRefreshing}) => {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingTweets, setLoadingTweets] = useState(true);
  const [fetchedTweets, setFetchedTweets] = useState<IFetchTweetData[]>([])
  const [selectedDataPoints, setDataPoints] = useState<IFetchTweetMapData[]>([])
  const [isMenuOpen, setMenu] = useState(false);
  const [isSidebar, setSidebar] = useState(false);
  const [tweetMapData, setTweetMapData] = useState<IFetchTweetMapData[]>([])
  const [selectedScale, setScale] = useState<'log' | 'linear'>('log');

  useEffect(() => {
    if (isSidebar) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto"
  }, [isSidebar]);


  useEffect(() => {
    const fetchTweetTimeMap = async () => {
      setRefreshing(true);
      const query = createDateQuery(date, '/api/tweet-time-map');
      const fetchedData = await (await fetch(query)).json() as IFetchTweetMapReq;
      setTweetMapData(fetchedData?.data ?? []);
      setLoading(false);
    };
    fetchTweetTimeMap();
  }, [refreshCount]);

  if (isLoading) return <div className="flex justify-center" style={{height: '600px'}}><Spinner/></div>

  const handleChange = (selectedScale: string) => {
    if (selectedScale === 'log' || selectedScale === 'linear')
      setScale(selectedScale)
    else throw Error(`Wrong scale selected: ${selectedScale}`)
  };

  const options = [
    {
      label: 'View Tweets', clickEvent: async () => {
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
    </div>
  );
};

export default TweetPatternContainer;