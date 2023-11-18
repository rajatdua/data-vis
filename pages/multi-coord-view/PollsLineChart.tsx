import React, {useEffect, useState} from 'react';
import D3PollsLineChart from "./D3PollsLineChart";
import Spinner from "../../components/Spinner/Spinner";
import {ICommonChartProps, IDataPoint, IFetchData, IFetchReq} from "../../types";
import {createDateQuery} from "../../utils/client";


const PollsLineChart: React.FC<ICommonChartProps> = ({ date, refreshCount, updateDateRange }) => {
    const [pollData, setPollData] = useState<IFetchData>({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPollData = async () => {
            const query = createDateQuery(date, '/api/polls');
            const result = await (await fetch(query)).json() as IFetchReq;
            setPollData(result?.data ?? {});
            setLoading(false);
        };
        fetchPollData();
    }, [refreshCount]);
    if (isLoading) return <div className="flex flex-col justify-center" style={{ height: '420px' }}><Spinner /></div>
    else {
        const {rcp_avg} = pollData;
        if (rcp_avg !== undefined) {
            const parseDate = (dateString: string): number => new Date(dateString).getTime();
            const processedData: IDataPoint[] = rcp_avg.sort((a, b) => parseDate(a.date) - parseDate(b.date)).map(item => ({
                ...item,
                // date: new Date(item.date).toLocaleDateString(), // Format the date
                date: item.date, // Format the date
            }));
            return (
                <div className="flex flex-col">
                    <D3PollsLineChart data={processedData} updateDateRange={updateDateRange} />
                </div>
            )
        } else return <div>No data found!</div>
    }
}

export default PollsLineChart;