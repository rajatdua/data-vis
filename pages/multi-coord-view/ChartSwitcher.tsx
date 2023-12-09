import React from "react";
import {DateValueType} from "react-tailwindcss-datepicker";
import SentimentContainer from "./SentimentContainer";
import TopInteractedContainer from "./TopInteractedContainer";
import TweetPatternContainer from "./TweetPatternContainer";
import WordCloudContainer from "./WordCloudContainer";
import {useAppStore} from "../../store/app";

interface IChartSwitcher {
  chartType: string,
  chartData: string[]
  date: DateValueType
}

const noop = () => { /**/ };

// const ChartSwitcher: React.FC<IChartSwitcher> = ({ chartData, chartType }) => {
//   switch (chartType) {
//     case 'sentiment':
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore - because chartData.content is unknown
//       return <ParentSize>{({ width }: { width: number }) => <ColumnChart handleColumnClick={noop} width={width} data={convertToSentimentArray(chartData.content, 'value')} onChartRender={noop} />}</ParentSize>
//     case 'word-cloud':
//       const updated: IInterimWordData[] = (toArray(chartData.content) ?? []).map((item: IFetchWordData) => ({
//         text: item?.text,
//         value: item?.textMeta?.count
//       }));
//       return <ParentSize>{({ width }: { width: number }) => <WordCloudV2 words={updated} width={width} handleWordClick={noop} />}</ParentSize>;
//     case 'top-interacted':
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore - because chartData.content is unknown
//       return <ParentSize>{({ width }: { width: number }) => <BarChart selectedSorting='desc' handleBarClick={noop} width={width} data={sortMostInteractedTweetData(chartData.content, 'desc')} onChartRender={noop} />}</ParentSize>
//     case 'tweet-time-map':
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore - because chartData.content is unknown
//       return <ScatterPlot data={chartData.content} scale={'log'} onBrush={noop} onChartRender={noop}/>
//     default:
//       return <div>Not Available: {chartType}</div>
//   }
// };

const ChartSwitcher: React.FC<IChartSwitcher> = ({ date, chartType, chartData }) => {

  const commonProps = {
    key: 'recursive',
    date,
    updateDateRange: noop,
    setRefreshing: noop,
    refreshCount: 0,
    recursive: { ids: chartData, graphKey: chartType }
}

  switch (chartType) {
    case 'sentiment':
      return <SentimentContainer {...commonProps} />
    case 'word-cloud':
      return <WordCloudContainer {...commonProps} version2={true} />
    case 'top-interacted':
      return <TopInteractedContainer {...commonProps} />
    case 'tweet-time-map':
      return <TweetPatternContainer {...commonProps} />
    default:
      return <div>Not Available: {chartType}</div>
  }
};

export default ChartSwitcher;