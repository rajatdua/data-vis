import React, {useEffect, useState} from "react";
import ChartSwitcher from "./ChartSwitcher";
import {useAppStore} from "../../store/app";
import {ICommonChartProps} from "../../types";
import {createDateQuery} from "../../utils/client";

interface IFloatingChartProps extends ICommonChartProps {
  graphsToRender: { [key: string]: boolean }
}

export interface IChartData {
  content: string[] //TODO: Change
}

interface IGraphReq {
  data: {
    [key: string]: IChartData
  }
}

const FloatingChartsContainer: React.FC<IFloatingChartProps> = ({ date, graphsToRender }) => {
  const { tweetIds } = useAppStore();
  const [fetchedGraphData, setFetchedGraphData] = useState({});
  useEffect(() => {
    const fetchAllGraphs = async () => {
      const graphKeys =  Object.keys(graphsToRender).join(',');
      const query = createDateQuery(date, '/api/floating', `&graphs=${graphKeys}`);
      const allGraphData = await (await fetch(query, { method: 'POST', body: JSON.stringify({ ids: tweetIds }) })).json() as IGraphReq
      setFetchedGraphData(allGraphData?.data ?? {});
    };
    fetchAllGraphs();
  }, []);
  return (
    <div>
      {Object.keys(fetchedGraphData).map(graphKey => {
        const chartData: IChartData = fetchedGraphData[graphKey as keyof typeof fetchedGraphData];
        return (
          <ChartSwitcher key={graphKey} chartType={graphKey} chartData={chartData} />
        );
      })}
    </div>
  );
};

export default FloatingChartsContainer;