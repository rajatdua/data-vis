import React, {useEffect, useState} from 'react';
import {CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Text, Tooltip, XAxis, YAxis} from 'recharts';
import Spinner from "../../components/Spinner/Spinner";
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
    if (isLoading) return <div className="flex flex-col justify-center" style={{ height: '420px' }}><Spinner /></div>
    else {
        const {rcp_avg} = pollData;
        if (rcp_avg !== undefined) {
            const parseDate = (dateString: string): number => new Date(dateString).getTime();
            const processedData = rcp_avg.sort((a, b) => parseDate(a.date) - parseDate(b.date)).map(item => ({
                ...item,
                date: new Date(item.date).toLocaleDateString(), // Format the date
            }));
            return (
                <div className="flex flex-col">
                    <Text x={500} y={20} textAnchor="middle" fontSize={16} fontWeight="bold">
                        Election Poll Results Over Time
                    </Text>
                    <ResponsiveContainer width="95%" height={420}>
                        <LineChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date" tick={{ fontSize: 12 }}>
                                {/*<Label value="Date" position="right"/> /!* X-axis label *!/*/}
                            </XAxis>
                            <YAxis>
                                <Label value="Percentage" angle={-90} position="insideLeft" /> {/* Y-axis label */}
                            </YAxis>
                            <Tooltip/>
                            <Legend align="center"/>
                            <Line type="monotone" dataKey="candidate[0].value" name="Democrat" stroke="blue"/>
                            <Line type="monotone" dataKey="candidate[1].value" name="Republican" stroke="red"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )
        } else return <div>No data found!</div>
    }
}

export default PollsLineChart;