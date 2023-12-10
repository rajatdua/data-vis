import {isEqual} from "lodash";
import Head from "next/head";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import Draggable from 'react-draggable';
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker";
import Popup from "../../components/Popup/Popup";
import FloatingChartsContainer from "./FloatingChartsContainer";
import PollsDistributionContainer from "./PollsDistributionContainer";
import SentimentContainer from "./SentimentContainer";
import TopInteractedContainer from "./TopInteractedContainer";
import TweetPatternContainer from "./TweetPatternContainer";
import WordCloudContainer from "./WordCloudContainer";
import ChartOverlay from "../../components/ChartOverlay/ChartOverlay";
import CustomButton from "../../components/CustomButton/CustomButton";
import Footer from "../../components/Footer/Footer";
import InfoButton from "../../components/InfoButton/InfoButton";
import Modal from "../../components/Modal/Modal";
import Nav from "../../components/Nav/Nav";
import Spinner from "../../components/Spinner/Spinner";
import {END_DATE, END_DATE_ALL, START_DATE, START_DATE_ALL} from "../../constants";
import { env } from "../../env.mjs"
import { useAppStore } from '../../store/app';
import {useDashState} from "../../store/dash";
import {useModalState} from "../../store/modal";
import {usePinnedState} from "../../store/pinned";
import {debounce} from "../../utils/client";
export default function MultiVariateData() {
    const { dashboardIds, dashboards, selectedDash } = useAppStore();
    const { setModal, isModalOpen, setModalVisibility, modalDetails } = useModalState();
    const { isPinned, pinnedDetails, isPinnedCollapsed, setPinnedCollapse, isPinnedOptions, setPinnedOptions, deletePinned } = usePinnedState();
    const [isInitialising, setInit] = useState(true);
    const [isError, setError] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [shouldHide, setHide] = useState(false);
    const [secBtnState, setSecBtnState] = useState({ isCollapsed: false })
    const [totalTweets, setTotalTweets] = useState(0);
    const { isDashOpen, setDashVisibility, setDashFlag } = useDashState();

    const handleSecClick = () => {
        setSecBtnState((prev) => ({...prev, isCollapsed: !prev.isCollapsed}))
    };
    useEffect(() => {
        const callInit = async () => {
            const response = await (await fetch('/api/init')).json() as { success: boolean };
            if (!response?.success) setError(true);
            setInit(false);
        }
        if(env.NEXT_PUBLIC_DATABASE_VERSION_CLIENT === 1)
            callInit();
    }, []);

    useEffect(() => {
        const onScroll = debounce(() => {
            if (!shouldHide && window.scrollY > 100) setHide(true)
            else if (shouldHide && window.scrollY <= 100) setHide(false)
        }, 150);
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [shouldHide]);

    useEffect(() => {
        if (!isDashOpen && dashboardIds.length > 0) setDashFlag(true);
    }, [dashboardIds.length]);

    useEffect(() => {
        if (isDashOpen && dashboardIds.length === 0) setDashFlag(false);
    }, [dashboardIds.length])

    useEffect(() => {
        if (isDashOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto"
        return () => { document.body.style.overflow = "auto" }
    }, [isDashOpen]);


    const [refreshCount, setRefreshCount] = useState(0);
    const [isRefreshing, setRefreshing] = useState(false);
    const [value, setValue] = useState<DateValueType>({
        startDate: START_DATE,
        endDate: END_DATE,
    });

    const handleValueChange = (newValue: DateValueType) => {
        setValue(newValue);
        if (!isEqual(value, newValue)) setRefreshCount(prevState => prevState + 1);
    };

    const handleResetDate = (identifier?: string) => {
        setValue((identifier === 'all' ? {
            startDate: START_DATE_ALL,
            endDate: END_DATE_ALL,
        } : {
            startDate: START_DATE,
            endDate: END_DATE,
        }));
        setRefreshCount(prevState => prevState + 1)
    };

    const handleClose = () => {
        setModal('', '', []);
        setModalVisibility(false);
    };

    const handleInfoClick = (chartType: string) => {
        let modalTitle = '';
        let modalChildren = '';
        switch (chartType) {
            case 'poll-average':
                modalTitle = 'Poll Average Information';
                modalChildren = 'Visualizing the average poll percentage distribution over time. The percentages does not add up to 100% because we only account for decided votes. "Decided Votes" are votes given to Hilliary Clinton or Donald Trump';

                break;
            case 'sentiment':
                modalTitle = 'Sentiment Analysis Information';
                modalChildren = 'Analyzing the sentiment (positive, negative, neutral) of Trump tweets. The criteria for positive is > +0.25, negative is < -0.25 and neutral is in-between that range.';

                break;
            case 'most-interacted':
                modalTitle = 'Most Interacted Tweets Information';
                modalChildren = 'Identifying the tweets with the highest engagement and interactions. It collates the interactions on the basis of favourites and retweets.';

                break;
            case 'word-cloud':
                modalTitle = 'Word Cloud Information';
                modalChildren = 'Displaying a word cloud based on the frequency of words in Trump tweets. To provide a general overview of usage of words in his tweets. Please note that the words do not have combined intended meanings - they are separate. \n We utilise the following normalisation techniques: Remove formatting, Removing Noise, Normalisation, Stopword Removal, Stemming.';

                break;
            case 'tweet-map':
                modalTitle = 'Tweeting Pattern Information';
                modalChildren = 'Mapping the time taken (before and after) a tweet that has been sent. There are two scales: Linear, Logarithmic. The line dots for logarithmic scale reveal a pattern that there might be tweets which were done with the help of bots. \n Mostly Trump used bots for retweeting positive tweets from his fans.';

                break;
            default:
                modalTitle = 'Trump Tweets Analysis';
                modalChildren = 'Displaying Trump\'s Tweets data for analysis';

                break;
        }
        setModal(modalTitle, modalChildren, []);
        setModalVisibility(true);
    };

    const renderCharts = () => {
        if (isInitialising && env.NEXT_PUBLIC_DATABASE_VERSION_CLIENT === 1) return <div className="flex justify-center" style={{ width: '100%', height: '77vh' }}><Spinner /></div>
        if (isError) return <div>An error occurred...</div>

        return (
            <div className="mx-auto place-self-center">
                <h2 className='font-bold flex justify-center'>General Election 2016 Poll Average (Trump vs Clinton) <InfoButton handleClick={() => handleInfoClick('poll-average')} /></h2>
                <PollsDistributionContainer
                  date={value}
                  refreshCount={refreshCount}
                  updateDateRange={handleValueChange}
                  resetDateRange={handleResetDate}
                  setRefreshing={setRefreshing}
                />
                <div className="grid grid-cols-2 gap-1">
                    <div>
                        <h2 className='mt-6 mb-2 font-bold justify-center flex'>Trump&apos;s Tweets Sentiment (Count: {totalTweets}) <InfoButton handleClick={() => handleInfoClick('sentiment')} /></h2>
                        <ChartOverlay isLoading={isRefreshing}>
                            <SentimentContainer
                              date={value}
                              refreshCount={refreshCount}
                              updateDateRange={handleValueChange}
                              setRefreshing={setRefreshing}
                              setTotalTweets={setTotalTweets}
                            />
                        </ChartOverlay>
                    </div>
                    <div>
                        <h2 className='mt-6 mb-2 font-bold flex justify-center'>Trump&apos;s Most Interacted Tweets <InfoButton handleClick={() => handleInfoClick('most-interacted')} /></h2>
                        <ChartOverlay isLoading={isRefreshing}>
                            <TopInteractedContainer
                              date={value}
                              refreshCount={refreshCount}
                              updateDateRange={handleValueChange}
                              setRefreshing={setRefreshing}
                            />
                        </ChartOverlay>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    <div>
                        <h2 className='mt-6 mb-2 font-bold flex justify-center'>Word Frequency for Trump&apos;s Tweet <InfoButton handleClick={() => handleInfoClick('word-cloud')} /></h2>
                        <ChartOverlay isLoading={isRefreshing}>
                            <WordCloudContainer
                              date={value}
                              refreshCount={refreshCount}
                              updateDateRange={handleValueChange}
                              version2={true}
                              setRefreshing={setRefreshing}
                            />
                        </ChartOverlay>
                    </div>
                    <div>
                        <h2 className='mt-6 mb-2 font-bold flex justify-center'>Trump&apos;s Tweeting Pattern <InfoButton handleClick={() => handleInfoClick('tweet-map')} /></h2>
                        <ChartOverlay isLoading={isRefreshing}>
                            <TweetPatternContainer
                              date={value}
                              refreshCount={refreshCount}
                              updateDateRange={handleValueChange}
                              setRefreshing={setRefreshing}
                            />
                        </ChartOverlay>
                    </div>
                </div>
            </div>
        );
    };

    const pinnedOptions = [
      { label: 'Unpin', icon: '/unpin-icon.svg', clickEvent: () => { deletePinned() }},
      {
          label: 'Details', icon: '/info-icon.svg', clickEvent: () => {
              setModal(pinnedDetails.dashboard.title, pinnedDetails.dashboard.description, []);
              setModalVisibility(true);
          }
      },
      { label: 'Close', icon: '/close-b-icon.svg', clickEvent: () => { setPinnedOptions(false) }}
    ];

    return (
        <>
            <Head>
                <meta property="og:url" content="https://data-vis-wqyg.vercel.app/"/>
                <meta
                    property="og:image"
                    content="/banner.png"
                />
                <meta property="og:image:width" content="1200"/>
                <meta property="og:image:height" content="630"/>
                <meta name="twitter:card" content="summary_large_image"/>
                <title>AU 2023 | US Election 2016 Analysis</title>
            </Head>
            <section className="w-full px-6 pb-2 antialiased bg-white">
                <div className="mx-auto max-w-7xl">
                    <Nav btnTitle="Back" btnHref="/" secBtnIcon={secBtnState.isCollapsed ? '/expand-icon.svg' : '/collapse-icon.svg'} secBtnClick={handleSecClick} secBtnState={secBtnState} />
                </div>
            </section>
            {(isPinned && !isPinnedCollapsed) && (<Draggable><div className='bg-white absolute z-50 border-2 border-black rounded' style={{ width: '42rem' }} key={pinnedDetails.id}>
                <div className='relative p-4'>
                    {pinnedDetails.node}
                    <div className='absolute -top-4 -right-4 bg-white border-2 border-black p-2 rounded' onClick={() => setPinnedCollapse(true)}>
                        <Image src='/collapse-b-icon.svg' alt='collapse' width={24} height={24}/>
                    </div>
                    <div className='absolute -top-4 -right-16 bg-white border-2 border-black p-2 rounded' onClick={() => setPinnedOptions(true)}>
                        <Image src='/menu-icon.svg' alt='collapse' width={24} height={24}/>
                    </div>
                    {isPinnedOptions && <div className='absolute top-10 -right-16'>
                        <Popup options={pinnedOptions}/>
                    </div>}
                </div>
            </div></Draggable>)}
            <div className={`transition-all ${isPinnedCollapsed ? 'opacity-100' : 'opacity-0'} fixed bottom-20 left-1 z-50`}>
                <div className='bg-indigo-500 border-2 border-black p-2 rounded' onClick={() => setPinnedCollapse(false)}>
                    <Image src='/expand-icon.svg' alt='collapse' width={24} height={24}/>
                </div>
            </div>

            <div className="flex flex-row">
                {/* Sidebar */}
                {isSidebarOpen && <aside className="bg-gray-100 w-64 p-4">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>

                    {/* Date Range */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Date Range</h3>
                        <Datepicker
                            value={value}
                            onChange={handleValueChange}
                            startFrom={new Date(START_DATE)}
                        />
                    </div>

                    {/* Add more filters here */}
                    <div className="mb-4">
                        <CustomButton handleClick={() => handleResetDate()} title='Reset Date' />
                    </div>
                    <div className="mb-4">
                        <CustomButton handleClick={() => handleResetDate('all')} title='All Available Tweets' />
                    </div>
                </aside>}

                {/* Main Content */}
                <div className={`flex-1 transition-all`}>
                    {/* Toggle Button */}
                    <CustomButton
                        style={{ top: '4.6rem' }}
                        className={`fixed right-6 z-10 ${shouldHide ? 'hidden' : ''}`}
                        handleClick={() => setSidebarOpen((isSidebarOpen) => !isSidebarOpen)}
                        icon={!isSidebarOpen ? '/hide-icon.svg' : '/view-icon.svg'}
                        title="Filter"
                    />
                    <div className="container max-w-lg px-4 mx-auto mt-px text-left md:max-w-none md:text-center">
                        {renderCharts()}
                    </div>
                </div>

            </div>
            {isModalOpen && (
              <Modal onClose={handleClose} modalTitle={modalDetails.title}>
                  {modalDetails.description}
              </Modal>
            )}
            <div className={`fixed z-30 transition-all h-full bg-white drop-shadow-md`} style={{ width: '40rem', right: isDashOpen ? 0 : '-40rem', top: 0 }}>
                <div className='relative h-full w-full'>
                    <p
                      className='-rotate-90 absolute top-44 bg-indigo-600 text-white text-sm font-medium px-5 py-3 text-center rounded-t-md z-40 cursor-pointer flex '
                      onClick={() => setDashVisibility()}
                      style={{
                          right: dashboardIds.length > 0 ? '37rem' : '37.5rem'
                      }}
                    >
                        Dashboards {dashboardIds.length > 0 ? <span>&nbsp;{`(${dashboardIds.length})`}</span> : ''}
                    </p>
                    <div className='h-full w-full overflow-x-hidden overflow-y-scroll'>
                        <h3 className='text-2xl py-2 px-5'>Dashboards</h3>
                        <div className={`grid ${dashboardIds.length > 0 ? selectedDash.id === '' ? 'grid-cols-2' : 'grid-cols-1' : 'grid-cols-1'} gap-1 place-items-center items-start`}>
                            {dashboardIds.length > 0 ? (
                              <FloatingChartsContainer
                                dashboardIds={dashboardIds}
                                dashboards={dashboards}
                                date={value}
                                refreshCount={refreshCount}
                                updateDateRange={handleValueChange}
                                setRefreshing={setRefreshing}
                              />
                            ): <div className='text-lg font-light'>No Dashboards</div>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}