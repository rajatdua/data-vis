import React from "react";
import {IChartData} from "./FloatingChartsContainer";

interface IChartSwitcher {
  chartType: string,
  chartData: IChartData
}

const ChartSwitcher: React.FC<IChartSwitcher> = ({ chartData, chartType }) => {
  switch (chartType) {
    case 'sentiment':
      return <div>Sentiment</div>;
    case 'word-cloud':
      return <div>Word Cloud</div>;
    case 'top-interacted':
      return <div>Top Interacted</div>;
    case 'tweet-time-map':
      return <div>Tweet Time-Map</div>;
  }
};

export default ChartSwitcher;