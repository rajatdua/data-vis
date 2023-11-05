import React, {useEffect, useState} from 'react';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {ICommonChartProps, IFetchData, IFetchReq} from "../../types";
import {createDateQuery} from "../../utils/client";


const PollsLineChart: React.FC<ICommonChartProps> = ({ date, refreshCount }) => {
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
    if (isLoading) return <div>Loading...</div>
    else {
        const {rcp_avg} = pollData;
        if (rcp_avg !== undefined) {
            const parseDate = (dateString: string): number => new Date(dateString).getTime();
            rcp_avg.sort((a, b) => parseDate(a.date) - parseDate(b.date));
            return (
                <LineChart width={600} height={400} data={rcp_avg}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="candidate[0].value" name="Democrat" stroke="blue"/>
                    <Line type="monotone" dataKey="candidate[1].value" name="Republican" stroke="red"/>
                </LineChart>
            )
        } else return <div>No data found!</div>
    }
}

export default PollsLineChart;