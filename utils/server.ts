import {isEmpty} from "lodash";
import {NextApiRequest, NextApiResponse} from "next";
import {ParseResult} from "papaparse";
import fs from 'fs';
import {IFrequencyObj} from "../types";

export const saveToJsonFile = (data: never | ParseResult<unknown> | IFrequencyObj, filePath: string) => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf8');
        console.log(`Data saved to ${filePath}`);
    } catch (error: unknown) {
        console.error('Error saving data to JSON file:', JSON.stringify(error));
    }
};

export const convertToTimestamp = (dateTimeString: string) => {
    // Parse the input string into a JavaScript Date object
    const dateObject = new Date(dateTimeString);

    // Check if the dateObject is valid
    if (isNaN(dateObject.getTime())) {
        console.error('Invalid date string');
        return null;
    }

    // Convert the Date object to a timestamp (in milliseconds)
    const timestamp = dateObject.getTime();

    // Divide by 1000 to get the timestamp in seconds (as SQL often uses seconds)
    return Math.floor(timestamp / 1000);
}

export const areDateParamsPresent = (req: NextApiRequest, res: NextApiResponse) => {
    const {start, end} = req.query;
    if ((isEmpty(start) && !isEmpty(end)) || (!isEmpty(start) && isEmpty(end))) res.status(500).json({
        error: false,
        errorMessage: 'Missing either start or end date'
    });
    const processedStart = typeof start === 'string' ? convertToTimestamp(start) : 0;
    const processedEnd = typeof end === 'string' ? convertToTimestamp(end) : 0;
    return {
        processedStart: processedStart === null ? 0 : processedStart,
        processedEnd: processedEnd === null ? 0 : processedEnd,
    }
};

const FUNCTIONS = {
    saveToJsonFile,
    convertToTimestamp,
    areDateParamsPresent,
};
export default FUNCTIONS;
