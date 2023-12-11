import {nanoid} from "nanoid";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {DateValueType} from "react-tailwindcss-datepicker";
import SentimentContainer from "./SentimentContainer";
import TopInteractedContainer from "./TopInteractedContainer";
import TweetPatternContainer from "./TweetPatternContainer";
import WordCloudContainer from "./WordCloudContainer";
import Popup from "../../components/Popup/Popup";
import {IDashboardType} from "../../store/app";
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
  const scratchRef = useRef(usePinnedState.getState().pinnedIds)

  const chartOptions = [
    {
      label: 'Pin', icon: '/pin-icon.svg', clickEvent: async () => {
        setPinned({ id: nanoid() , node: renderCharts(), dashboard: selectedDash, isPinnedOptions: false, isPinned: scratchRef.current.length <= 1, chartTitle: getChartTitle(chartType) });
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

  const [isMenuOpen, setMenu] = useState(false);

  useEffect(() => usePinnedState.subscribe(
    state => (scratchRef.current = state.pinnedIds)
  ), [])


  const renderCharts = () => {
    const { depth, title, description } = selectedDash ?? {};
     const commonProps = {
       key: 'recursive',
       date,
       updateDateRange: noop,
       setRefreshing: noop,
       refreshCount: 0,
       recursive: { ids: chartData, graphKey: chartType, prevDescription: `<p><b>Level ${depth}: </b>${title} <br/>${description}</p>`, depth }
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
        <div className='relative'>
          <Image src='/menu-icon.svg' alt='menu' width={24} height={24} onClick={() => setMenu(prevState => !prevState)} />
          {isMenuOpen && <Popup options={chartOptions} />}
        </div>
      </div>
      {renderCharts()}
    </div>
  );
};

export default ChartSwitcher;