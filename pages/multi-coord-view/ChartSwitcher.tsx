import {nanoid} from "nanoid";
import Image from "next/image";
import React, {useState} from "react";
import {DateValueType} from "react-tailwindcss-datepicker";
import {IDashboardType} from "../../store/app";
import SentimentContainer from "./SentimentContainer";
import TopInteractedContainer from "./TopInteractedContainer";
import TweetPatternContainer from "./TweetPatternContainer";
import WordCloudContainer from "./WordCloudContainer";
import Popup from "../../components/Popup/Popup";
import {useDashState} from "../../store/dash";
import {usePinnedState} from "../../store/pinned";

interface IChartSwitcher {
  chartType: string,
  chartData: string[]
  date: DateValueType,
  selectedDash: IDashboardType
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

const ChartSwitcher: React.FC<IChartSwitcher> = ({ date, chartType, chartData, selectedDash }) => {
  const { setPinned } = usePinnedState();
  const { setDashFlag } = useDashState();

  const [isMenuOpen, setMenu] = useState(false);

  const chartOptions = [
    {
      label: 'Pin', icon: '/pin-icon.svg', clickEvent: async () => {
        setPinned({ id: nanoid() , node: renderCharts(), dashboard: selectedDash });
        setDashFlag(false);
        setMenu(false);
      }
    },
    {
      label: 'Close', icon: '/close-b-icon.svg', clickEvent: async () => {
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
          <Image src='/menu-icon.svg' alt='menu' width={24} height={24} onClick={() => setMenu(prevState => !prevState)} />
          {isMenuOpen && <Popup options={chartOptions} />}
        </span>
      </div>
      {renderCharts()}
    </div>
  );
};

export default ChartSwitcher;