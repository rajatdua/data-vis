import ParentSize from "@visx/responsive/lib/components/ParentSize";
import {toArray} from "lodash";
import React from "react";
import ScatterPlot from "../../components/ScatterPlot/ScatterPlot";
import {convertToSentimentArray} from "./SentimentContainer";
import {sortMostInteractedTweetData} from "./TopInteractedContainer";
import BarChart from "../../components/BarChart/BarChart";
import ColumnChart from "../../components/ColumnChart/ColumnChart";
import WordCloudV2 from "../../components/WordCloud/WordCloudV2";
import {IChartData, IFetchWordData, IInterimWordData} from "../../types";

interface IChartSwitcher {
  chartType: string,
  chartData: IChartData
}

const noop = () => { /**/ };

const ChartSwitcher: React.FC<IChartSwitcher> = ({ chartData, chartType }) => {
  switch (chartType) {
    case 'sentiment':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - because chartData.content is unknown
      return <ParentSize>{({ width }: { width: number }) => <ColumnChart handleColumnClick={noop} width={width} data={convertToSentimentArray(chartData.content, 'value')} onChartRender={noop} />}</ParentSize>
    case 'word-cloud':
      const updated: IInterimWordData[] = (toArray(chartData.content) ?? []).map((item: IFetchWordData) => ({
        text: item?.text,
        value: item?.textMeta?.count
      }));
      return <ParentSize>{({ width }: { width: number }) => <WordCloudV2 words={updated} width={width} handleWordClick={noop} />}</ParentSize>;
    case 'top-interacted':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - because chartData.content is unknown
      return <ParentSize>{({ width }: { width: number }) => <BarChart selectedSorting='desc' handleBarClick={noop} width={width} data={sortMostInteractedTweetData(chartData.content, 'desc')} onChartRender={noop} />}</ParentSize>
    case 'tweet-time-map':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - because chartData.content is unknown
      return <ScatterPlot data={chartData.content} scale={'log'} onBrush={noop} onChartRender={noop}/>
    default:
      return <div>Not Available</div>
  }
};

export default ChartSwitcher;