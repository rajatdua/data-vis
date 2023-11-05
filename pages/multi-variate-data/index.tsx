import {isEqual} from "lodash";
import Head from "next/head";
import {useState} from "react";
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker";
import PollsLineChart from "./PollsLineChart";
import WordCloud from "./WordCloud";
import {END_DATE, START_DATE} from "../../constants";

// const getErrorMessage = (error: unknown) => {
//     if (error instanceof Error) return error.message
//     return String(error)
// }

export default function MultiVariateData() {
    const [refreshCount, setRefreshCount] = useState(0);
    const [value, setValue] = useState<DateValueType>({
        startDate: START_DATE,
        endDate: END_DATE,
    });

    const handleValueChange = (newValue: DateValueType) => {
        setValue(newValue);
        if (!isEqual(value, newValue)) setRefreshCount(prevState => prevState + 1);
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
                    <div className="mx-auto place-self-center">
                        <PollsLineChart date={value} refreshCount={refreshCount} />
                        <WordCloud date={value} refreshCount={refreshCount} />
                    </div>
                </div>
            </section>
        </>
    );
}