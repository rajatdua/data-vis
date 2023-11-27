import React, {useEffect, useState} from 'react';
import LineChart from "../../components/LineChart/LineChart";
import Spinner from "../../components/Spinner/Spinner";
import {ICommonChartProps, IDataPoint, IFetchData, IFetchReq} from "../../types";
import {createDateQuery} from "../../utils/client";


const PollsDistributionContainer: React.FC<ICommonChartProps> = ({ date, refreshCount, updateDateRange, resetDateRange, setRefreshing }) => {
    const [pollData, setPollData] = useState<IFetchData>({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPollData = async () => {
            setRefreshing(true);
            const query = createDateQuery(date, '/api/polls');
            const result = await (await fetch(query)).json() as IFetchReq;
            setPollData(result?.data ?? {});
            setLoading(false);
        };
        fetchPollData();
    }, [refreshCount]);

    const handleChartRender = () => {
        setRefreshing(false);
    };

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
                    <LineChart data={processedData} updateDateRange={updateDateRange} resetDateRange={resetDateRange} onChartRender={handleChartRender}/>
                </div>
            )
        } else return <div>No data found!</div>
    }
}

export default PollsDistributionContainer;