import {isEqual} from "lodash";
import Head from "next/head";
import {useEffect, useState} from "react";
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker";
import PollsLineChart from "./PollsLineChart";
import WordCloudContainer from "./WordCloudContainer";
import {END_DATE, START_DATE} from "../../constants";

export default function MultiVariateData() {
    const [isInit, setInit] = useState(true);
    const [isError, setError] = useState(false);
    useEffect(() => {
        const callInit = async () => {
            const response = await (await fetch('/api/init')).json() as { success: boolean };
            if (!response?.success) setError(true);
            setInit(false);
        }
        callInit();
    }, []);
    const [refreshCount, setRefreshCount] = useState(0);
    const [value, setValue] = useState<DateValueType>({
        startDate: START_DATE,
        endDate: END_DATE,
    });

    const handleValueChange = (newValue: DateValueType) => {
        setValue(newValue);
        if (!isEqual(value, newValue)) setRefreshCount(prevState => prevState + 1);
    };

    const renderCharts = () => {
        if (isInit) return <div>Loading...</div>
        if (isError) return <div>An error occurred...</div>
        return (
            <div className="mx-auto place-self-center">
                <PollsLineChart date={value} refreshCount={refreshCount}/>
                <WordCloudContainer date={value} refreshCount={refreshCount}/>
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
            <section className="bg-white dark:bg-gray-900">
                <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16 lg:pb-0">
                    <Datepicker
                        value={value}
                        onChange={handleValueChange}
                        startFrom={new Date(START_DATE)}
                    />
                    {renderCharts()}
                </div>
            </section>
        </>
    );
}