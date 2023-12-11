import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, {useEffect, useState} from "react";
import BarChart from "../../components/BarChart/BarChart";
import {getIndex} from "../../components/BarChart/utils";
import Modal from "../../components/Modal/Modal";
import Popup from "../../components/Popup/Popup";
import Select from "../../components/Select/Select";
import Spinner from "../../components/Spinner/Spinner";
import Tweet from "../../components/Tweet/Tweet";
import {INIT_SELECTED_TWEET} from "../../constants";
import {useAppStore} from "../../store/app";
import {
  ICommonChartProps, IFetchMostInteractedReq,
  MostInteractedTweet,
} from "../../types";
import {createDashboard, createDateQuery, fetchFloatingType} from "../../utils/client";

export function sortMostInteractedTweetData(mostInteractedTweets: MostInteractedTweet[], selectedSort: string): MostInteractedTweet[] {
  if (selectedSort === 'asc')
  // Sort the array based on the "ascending" property
    return [...mostInteractedTweets].sort((a, b) => a.totalInteractions - b.totalInteractions);
  else if (selectedSort === 'desc')
    // Sort the array based on the "descending" property
    return [...mostInteractedTweets].sort((a, b) => b.totalInteractions - a.totalInteractions);
  return mostInteractedTweets;
}

const sortOptions = [{value: 'asc', label: 'Ascending'}, {value: 'desc', label: 'Descending'}];
const countOptions = [{value: 3, label: 'Top 3'}, {value: 4, label: 'Top 4'}, {value: 5, label: 'Top 5'}];

const TopInteractedContainer: React.FC<ICommonChartProps> = ({ date, refreshCount, setRefreshing, recursive = { ids: [], graphKey: '', prevDescription: '', depth: 0 } }) => {
  const { setGraphToRender, setTweetIds, setTitle, setDashboard } = useAppStore();

  const [mostInteractedTweets, setInteractedTweets] = useState<MostInteractedTweet[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedSorting, setSort] = useState<'asc' | 'desc'>('desc');
  const [selectedTopCount, setTopSelection] = useState<3|4|5>(3);
  const [isMenuOpen, setMenu] = useState(false);
  const [isModalOpen, setModal] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState<MostInteractedTweet>(INIT_SELECTED_TWEET);
  const [modalTitle, setModalTitle] = useState('');

  const { ids, graphKey, prevDescription, depth } = recursive;

  useEffect(() => {
    const fetchMostInteraction = async () => {
      setRefreshing(true);
      const query = createDateQuery(date, '/api/most-interacted', `&top=${selectedTopCount}`);
      const result = await (await fetch(query)).json() as IFetchMostInteractedReq;
      const safeResult = result.data ?? [];
      setInteractedTweets(safeResult);
      setLoading(false);
      setRefreshing(false);
    };
    if (ids.length === 0) fetchMostInteraction();
  }, [refreshCount, selectedTopCount]);

  useEffect(() => {
    if (ids.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - TODO: I NEED TO USE setData as COMMON METHOD; LONG WAY IS USING TYPESCRIPT TEMPLATES I DON'T HAVE TIME FOR THIS
      fetchFloatingType({ date, ids, graphKey }, { setData: setInteractedTweets, setLoading });
    }
  }, [ids]);

  const handleChartRender = () => {
    setRefreshing(false);
  };

  const handleChange = (pickedSorting: string) => {
    if (pickedSorting === 'asc' || pickedSorting === 'desc')
      setSort(pickedSorting)
    else throw Error(`Wrong sort selected: ${pickedSorting}`)
  };
  const handleChangeTop = (pickedTop: string) => {
    if (pickedTop === '3' || pickedTop === '4' || pickedTop === '5') {
      setTopSelection(+pickedTop as 3 | 4 | 5);
      setSort('desc');
    }
    else throw Error(`Wrong top count selected: ${pickedTop}`)
  };

  const handleBarClick = (_: React.MouseEvent, data: MostInteractedTweet) => {
    setSelectedTweet(data);
    setMenu(true);
  };

  const handleClose = () => {
    setMenu(false);
    setModal(false);
    setSelectedTweet(INIT_SELECTED_TWEET);
    setModalTitle('')
  };

  const getTitle = () => {
    const sortedTweets = sortMostInteractedTweetData(mostInteractedTweets, selectedSorting)
    const index = sortedTweets.findIndex((currTweet) => currTweet.id === selectedTweet.id);
    return getIndex(index, sortedTweets.length, selectedSorting);
  };

  const options = [
    {
      label: 'View Tweet', icon: '/view-b-icon.svg', clickEvent: () => {
        setMenu(false);
        setModalTitle(`#${getTitle() + 1} Tweet`)
        setModal(true);
      }
    },
    {
      label: 'Open Tweet', icon: '/open-link-icon.svg', clickEvent: () => {
        setMenu(false);
        window.open(
          selectedTweet.link,
          '_blank'
        );
      }
    },
    { label: 'Explore', icon: '/explore-icon.svg', clickEvent: () => {
        createDashboard(
          [selectedTweet.id],
          { 'word-cloud': true, 'tweet-time-map': true, 'sentiment': true },
          { date, container: 'Top Interacted', depth, description: `Subset: #${getTitle() + 1} Tweet${prevDescription === '' ? '' : `<p><br/>${prevDescription}</p>`}` },
          { setGraphToRender, setTweetIds, setTitle, setDashboard }
        );
        setMenu(false);
      } },
    {
      label: 'Close', icon: '/close-b-icon.svg', clickEvent: handleClose
    },
  ];

  if (isLoading) return <div className="flex flex-col justify-center" style={{ height: '420px' }}><Spinner /></div>
  else {
    return (
      <div className='relative'>
      <div className="flex justify-end">
        <Select hideLabel={true} handleChange={handleChangeTop} options={countOptions} preSelected={selectedTopCount}/>
        <Select handleChange={handleChange} options={sortOptions} preSelected={selectedSorting}/>
      </div>
      <ParentSize>{({ width }: { width: number }) => <BarChart selectedSorting={selectedSorting} handleBarClick={handleBarClick} width={width} data={sortMostInteractedTweetData(mostInteractedTweets, selectedSorting)} onChartRender={handleChartRender} />}</ParentSize>
        {isMenuOpen && (
          <Popup options={options}/>
        )}
        {isModalOpen && (
          <Modal onClose={handleClose} modalTitle={modalTitle}>
            <Tweet tweetHTML={selectedTweet.content} link={selectedTweet.link} />
          </Modal>
        )}
      </div>
    );
  }
};

export default TopInteractedContainer;