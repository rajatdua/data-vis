import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { IRCPAvg } from "../../types";

interface ComponentProps {
    data: IRCPAvg[]
}

const PollsLineChart: React.FC<ComponentProps> = ({ data }) => {
    return (
        <LineChart width={600} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="candidate[0].value" name="Democrat" stroke="blue" />
            <Line type="monotone" dataKey="candidate[1].value" name="Republican" stroke="red" />
        </LineChart>
    )
}

export default PollsLineChart;