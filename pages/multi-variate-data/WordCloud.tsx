import React, { useEffect, useState } from "react";
import {ICommonChartProps, IFetchWordData, IFetchWordReq} from "../../types";
import {createDateQuery} from "../../utils/client";

const WordCloud: React.FC<ICommonChartProps>  = ({ date, refreshCount }) => {
    const [isLoading, setLoading] = useState(true);
    const [wordCloudData, setWordCloud] = useState<IFetchWordData[]>([]);
    useEffect(() => {
        const fetchWordCloud = async () => {
            const query = createDateQuery(date, '/api/word-cloud');
            const fetchedData = await (await fetch(query)).json() as IFetchWordReq;
            const wordList = fetchedData?.data ?? [];
            setWordCloud(wordList);
            setLoading(false);
        };
        fetchWordCloud();
    }, [refreshCount]);

    if (isLoading) return <div>Loading...</div>
    return (
        <div>
            <ul className="grid grid-cols-4 gap-16">
                {wordCloudData.map((item) => {
                    return <li className="border p-4 text-center" key={item.text}><p><b>{item.text}</b></p><span>{item.size}</span></li>;
                })}
            </ul>
        </div>
    );
}

export default WordCloud;