import {isEmpty} from "lodash";
import {NextApiRequest, NextApiResponse} from "next";
import normalize from "normalize-text";
import {ParseResult} from "papaparse";
import {QueryExecResult, SqlValue} from "sql.js";
import {eng, removeStopwords} from "stopword";
import fs from 'fs';
import {IFrequencyObj} from "../types";
// import natural from 'natural';
// const stemmer = natural.PorterStemmer;

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

interface ISQLConfig {
    renameColumn: { [key: string]: string }
}
export function convertToObjects(queryResult: QueryExecResult[], config: ISQLConfig = { renameColumn: {} }): FlatArray<{ [p: string]: SqlValue }[][], 1>[] {
    const { renameColumn = {} } = config;
    return queryResult.map((data) => {
        return data.values.map((row) => {
            const obj: { [key: string]: SqlValue } = {};
            data.columns.forEach((column, index) => {
                const selectedFromConfig = renameColumn[column];
                const newColumnName = selectedFromConfig ?? column;
                obj[newColumnName] = row[index];
            });
            return obj;
        });
    }).flat();
}


export const preProcessContent = (content: string) => {
    // 1. Remove formatting: HTML tags
    content = content.replace(/<[^>]*>/g, "");
    // content = content.replace(/^(twitter\.com\/[a-zA-Z0-9_]+)$/i, 'https://$1');
    content = content.replace(/^(?:(twitter\.com\/|pic\.twitter\.com\/))[a-zA-Z0-9_]+$/i, 'https://$1');

    content = content.replace(/(https?:\/\/)/, ' https://');

    // 2. Remove Noise
    content = normalize(content)
    content = content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ''); // Remove URLs
    content = content.replace(/(@\s*\w+|#\s*\w+)/g, '')
    content = content.replace(/[’|']s|i'm/g, '')
    content = content.replace(/[^\w\s]|['’"`]/g, '')
    // content = content.replace(/[\u2018\u2019]/g, "'"); // Replace special single-quotes
    // content = content.replace(/[\u201C\u201D]/g, '"'); // Replace special double-quotes
    // content = content.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII chars



    // 3. Lowercasing
    content = content.toLowerCase();

    // 4. Normalisation: This is tricky as it requires understanding the context and language nuances
    content = content.replace(/\bu\b/g, 'you');
    // pm or am
    content = content.replace(/\bpm\b/g, '');
    content = content.replace(/\bam\b/g, '');
    // mr. or mr
    content = content.replace(/\bmr\.?\s*/g, '');

    // 5. Stopword Removal
    content = removeStopwords(content.split(' '), eng).join(' ');

    // 6. Stemming
    // content = stemmer.stem(content);

    // 7. Lemmatization: Natural library doesn't support lemmatization for English.
    // might need to use a Python library like NLTK or SpaCy for this.

    content = content.split(/\s+/).filter(word => word!=='').join(' ')

    return content;

};


const FUNCTIONS = {
    saveToJsonFile,
    convertToTimestamp,
    areDateParamsPresent,
    convertToObjects,
    preProcessContent,
};
export default FUNCTIONS;
