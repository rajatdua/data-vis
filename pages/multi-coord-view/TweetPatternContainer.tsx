import React, {useEffect, useState} from "react";
import ScatterPlot from "../../components/ScatterPlot/ScatterPlot";
import Spinner from "../../components/Spinner/Spinner";
import {ICommonChartProps, IFetchTweetMapData, IFetchTweetMapReq} from "../../types";
import {createDateQuery} from "../../utils/client";

const TweetPatternContainer: React.FC<ICommonChartProps> = ({ date, refreshCount }) => {
  const [isLoading, setLoading] = useState(true);
  const [tweetMapData, setTweetMapData] = useState<IFetchTweetMapData[]>([])
  useEffect(() => {
    const fetchTweetTimeMap = async () => {
      const query = createDateQuery(date, '/api/tweet-time-map');
      const fetchedData = await (await fetch(query)).json() as IFetchTweetMapReq;
      setTweetMapData(fetchedData?.data ?? [])
      setLoading(false);
    };
    fetchTweetTimeMap();
  }, [refreshCount]);

  if (isLoading) return <div className="flex justify-center" style={{ height: '600px' }}><Spinner /></div>

  return (
    <div>
      <ScatterPlot data={tweetMapData} />
    </div>
  );
};

export default TweetPatternContainer;