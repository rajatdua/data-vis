import {isEqual} from "lodash";
import Head from "next/head";
import {useEffect, useState} from "react";
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker";
import PollsDistributionContainer from "./PollsDistributionContainer";
import SentimentContainer from "./SentimentContainer";
import TopInteractedContainer from "./TopInteractedContainer";
import TweetPatternContainer from "./TweetPatternContainer";
import WordCloudContainer from "./WordCloudContainer";
import ChartOverlay from "../../components/ChartOverlay/ChartOverlay";
import CustomButton from "../../components/CustomButton/CustomButton";
import Footer from "../../components/Footer/Footer";
import Nav from "../../components/Nav/Nav";
import Spinner from "../../components/Spinner/Spinner";
import {END_DATE, START_DATE} from "../../constants";
import {debounce} from "../../utils/client";

export default function MultiVariateData() {
    const [isInit, setInit] = useState(true);
    const [isError, setError] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [shouldHide, setHide] = useState(false);
    const [secBtnState, setSecBtnState] = useState({ isCollapsed: false })
    const [totalTweets, setTotalTweets] = useState(0);
    const handleSecClick = () => {
        setSecBtnState((prev) => ({...prev, isCollapsed: !prev.isCollapsed}))
    };
    useEffect(() => {
        const callInit = async () => {
            const response = await (await fetch('/api/init')).json() as { success: boolean };
            if (!response?.success) setError(true);
            setInit(false);
        }
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

    const handleResetDate = () => {
        setValue({
            startDate: START_DATE,
            endDate: END_DATE,
        });
        setRefreshCount(prevState => prevState + 1)
    };

    const renderCharts = () => {
        if (isInit) return <div className="flex justify-center" style={{ width: '100%', height: '77vh' }}><Spinner /></div>
        if (isError) return <div>An error occurred...</div>
        return (
            <div className="mx-auto place-self-center">
                <h2 className='font-bold'>General Election 2016 Poll Average (Trump vs Clinton)</h2>
                <PollsDistributionContainer
                  date={value}
                  refreshCount={refreshCount}
                  updateDateRange={handleValueChange}
                  resetDateRange={handleResetDate}
                  setRefreshing={setRefreshing}
                />
                <div className="grid grid-cols-2 gap-1">
                    <div>
                        <h2 className='mt-6 mb-2 font-bold'>Trump&apos;s Tweets Sentiment (Count: {totalTweets})</h2>
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
                        <h2 className='mt-6 mb-2 font-bold'>Trump&apos;s Most Interacted Tweets</h2>
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
                        <h2 className='mt-6 mb-2 font-bold'>Word Frequency for Trump&apos;s Tweet</h2>
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
                        <h2 className='mt-6 mb-2 font-bold'>Trump&apos;s Tweeting Pattern</h2>
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
                {/*<div className="grid grid-cols-2 gap-1">*/}
                {/*    <WordCloudContainer date={value} refreshCount={refreshCount} updateDateRange={handleValueChange} version2={true}/>*/}
                {/*</div>*/}
            </div>
        );
    };

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
                    {/* Example:
                    <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Your Filter Title</h3>
                        {/* Your filter component goes here
                    </div>
                */}
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

            <Footer />
        </>
    );
}