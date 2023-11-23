import React, {useEffect, useState} from "react";
import ScatterPlot from "../../components/ScatterPlot/ScatterPlot";
import Select from "../../components/Select/Select";
import Spinner from "../../components/Spinner/Spinner";
import {ICommonChartProps, IFetchTweetMapData, IFetchTweetMapReq} from "../../types";
import {createDateQuery} from "../../utils/client";

const scaleOptions = [{value: 'log', label: 'Log Scale'}, {value: 'linear', label: 'Linear Scale'}];

const TweetPatternContainer: React.FC<ICommonChartProps> = ({ date, refreshCount }) => {
  const [isLoading, setLoading] = useState(true);
  const [tweetMapData, setTweetMapData] = useState<IFetchTweetMapData[]>([])
  const [selectedScale, setScale] = useState<'log' | 'linear'>('log');
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

  const handleChange = (selectedScale: string) => {
    if (selectedScale === 'log' || selectedScale === 'linear')
      setScale(selectedScale)
    else throw Error(`Wrong scale selected: ${selectedScale}`)
  };

  return (
    <div>
      <div className="flex justify-end">
        <Select handleChange={handleChange} options={scaleOptions} preSelected={selectedScale} />
      </div>
      <ScatterPlot data={tweetMapData} scale={selectedScale} />
    </div>
  );
};

export default TweetPatternContainer;