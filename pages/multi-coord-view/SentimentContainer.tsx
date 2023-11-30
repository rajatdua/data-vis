import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, {useEffect, useState} from "react";
import ColumnChart from "../../components/ColumnChart/ColumnChart";
import Select from "../../components/Select/Select";
import Spinner from "../../components/Spinner/Spinner";
import {INIT_SENTIMENT} from "../../constants";
import {ICommonChartProps, IFetchSentimentData, IFetchSentimentReq, SentimentItem} from "../../types";
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
  const [isLoading, setLoading] = useState(true);
  const [selectedScale, setScale] = useState<'name' | 'value'>('value');


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

  // TODO: Give ability to select bars and show pop-up menu for export
  if (isLoading) return <div className="flex flex-col justify-center" style={{ height: '420px' }}><Spinner /></div>
  else {
    return (
      <div>
      <div className="flex justify-end">
        <Select handleChange={handleChange} options={scaleOptions} preSelected={selectedScale}/>
      </div>
      <ParentSize>{({ width }: { width: number }) => <ColumnChart width={width} data={convertToSentimentArray(sentimentData, selectedScale)} onChartRender={handleChartRender} />}</ParentSize>
      </div>
    );
  }
};

export default SentimentContainer;