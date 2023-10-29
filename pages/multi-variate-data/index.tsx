import Head from "next/head";
import { useEffect, useState } from 'react';
import PollsLineChart from "./PollsLineChart";
import { IFetchData, IFetchReq } from "../../types";

// const getErrorMessage = (error: unknown) => {
//     if (error instanceof Error) return error.message
//     return String(error)
// }

const renderPoll = (isLoading: boolean, fetchedData: IFetchData) => {
    if (isLoading) return <div>Loading...</div>
    else {
        const { rcp_avg } = fetchedData;
        if (rcp_avg !== undefined) {
            const parseDate = (dateString: string): number => new Date(dateString).getTime();
            rcp_avg.sort((a, b) => parseDate(a.date) - parseDate(b.date));
            return <PollsLineChart data={rcp_avg} />
        }
        else return <div>No data found!</div>
    }
};
export default function MultiVariateData() {
    const [pollData, setPollData] = useState<IFetchData>({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPollData = async () => {
            const result = await (await fetch('/api/polls')).json() as IFetchReq;
            setPollData(result?.data ?? {});
            setLoading(false);
        };
        fetchPollData();
    }, []);
    return (
    <>
    <Head>
        <meta property="og:url" content="https://data-vis-wqyg.vercel.app/" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/*/*.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>AU 2023 | US Election 2016 Analysis</title>
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16 lg:pb-0">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              View
            </h1>
              {renderPoll(isLoading, pollData)}
          </div>
        </div>
      </section>
    </>
    );
}