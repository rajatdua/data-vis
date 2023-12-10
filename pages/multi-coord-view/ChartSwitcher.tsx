import Image from "next/image";
import React, {useState} from "react";
import {DateValueType} from "react-tailwindcss-datepicker";
import SentimentContainer from "./SentimentContainer";
import TopInteractedContainer from "./TopInteractedContainer";
import TweetPatternContainer from "./TweetPatternContainer";
import WordCloudContainer from "./WordCloudContainer";
import Popup from "../../components/Popup/Popup";

interface IChartSwitcher {
  chartType: string,
  chartData: string[]
  date: DateValueType
}

const noop = () => { /**/ };

const getChartTitle = (chartType: string) => {

  switch (chartType) {
    case 'sentiment':
      return 'Trump\'s Tweets Sentiment';
    case 'word-cloud':
      return 'Word Frequency for Trump\'s Tweet';
    case 'top-interacted':
      return 'Trump\'s Most Interacted Tweets';
    case 'tweet-time-map':
      return 'Trump\'s Tweeting Pattern';
    default:
      return '';
  }
};

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

  const [isMenuOpen, setMenu] = useState(false);

  const chartOptions = [
    {
      label: 'Pin', clickEvent: async () => {
        setMenu(false);
      }
    },
    {
      label: 'Close', clickEvent: async () => {
        setMenu(false);
      }
    },
  ];

  const renderCharts = () => {
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

  return (
    <div className='flex flex-col mt-8'>
      <div className='flex flex-row justify-between px-2 py-4 items-center'>
        <span className='font-bold'>{getChartTitle(chartType)}</span>
        <span className='relative'>
          <Image src='/menu-icon.svg' alt='menu' width={24} height={24} onClick={() => setMenu(prevState => !prevState)}/>
          {isMenuOpen && <Popup options={chartOptions} />}
        </span>
      </div>
      {renderCharts()}
    </div>
  );
};

export default ChartSwitcher;