import {NextApiRequest, NextApiResponse} from "next";
import polls from './polls-2016.json';
import {areDateParamsPresent, convertToTimestamp} from "../../utils/server";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json');
    const {processedStart, processedEnd} = areDateParamsPresent(req, res);
    const filteredData = polls.rcp_avg.filter((entry) => {
        const entryDate = convertToTimestamp(entry.date) ?? 0;
        return entryDate >= processedStart && entryDate <= processedEnd;
    });

    res.status(200).json({
        data: {
            ...polls,
            rcp_avg: filteredData
        }
    })
}
