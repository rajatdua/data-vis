import {isEmpty} from "lodash";
import {NextApiRequest, NextApiResponse} from "next";
import {QueryExecResult, SqlValue} from "sql.js";
import {removeStopwords} from 'stopword';
import {IFrequencyObj, tweetMetaType} from "../../types";
import {getErrorMessage} from "../../utils/common";
import getDB from '../../utils/db';
import {areDateParamsPresent /*, saveToJsonFile*/} from "../../utils/server";

function convertToObjects(queryResult: QueryExecResult[]): FlatArray<{ [p: string]: SqlValue }[][], 1>[] {
    return queryResult.map((data) => {
        return data.values.map((row) => {
            const obj: { [key: string]: SqlValue } = {};
            data.columns.forEach((column, index) => {
                obj[column] = row[index];
            });
            return obj;
        });
    }).flat();
}

const filterOne = (word: string) => {
    // Remove links
    return word.replace(/(https?:\/\/[^\s]+|www\.[^\s]+|\b(?:[a-z\d]+\.)+[a-z]{2,}\b)/g, '')
    // Remove mentions and hashtags
        .replace(/(@\s*\w+|#\s*\w+)/g, '')
    // remove plural
        .replace(/[’|']s|i'm|via|mr|say|cant|/g, '')
    // Remove special characters and extra quotes
        .replace(/[^\w\s]|['’"`]/g, '')
    // Remove numbers less than 4 digits
        .replace(/\b\d{1,3}\b/g, '');
};

// const filterTwo = (word: string) => {
//     const linksRegex = /[https|http]?:\/\/\S+/g;
//     const mentionsRegex = /@ ([a-zA-Z0-9_]+)/g;
//     const hashtagsRegex = /#([a-zA-Z0-9_]+)/g;
//     const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>-]/g;
//     return word
//         .replace(linksRegex, '')  // Remove links
//         .replace(mentionsRegex, '')  // Remove mentions
//         .replace(hashtagsRegex, '')  // Remove hashtags
//         .replace(specialCharsRegex, '') // Remove special characters
// };

const calculateFrequency = (dataArray: FlatArray<{ [p: string]: SqlValue }[][], 1>[]) => {
    const wordFrequency: IFrequencyObj = {};

    dataArray.forEach((item) => {
        // Tokenize the content
        const content: SqlValue | undefined = (item?.content ?? '').toString().toLowerCase();
        const cleanedContent = filterOne(content);
        const words = cleanedContent.split(/\s+/);
        const filteredWords = words.filter(word => word !== '');
        const processedWords = processText(filteredWords);
        processedWords.forEach((word: string) => {
            if (isEmpty(wordFrequency[word])) {
                wordFrequency[word] = {
                    count: 1,
                    tweets: [content]
                };
            } else {
                wordFrequency[word] = {
                    count: wordFrequency[word].count + 1,
                    tweets: [...wordFrequency[word].tweets, content]
                };
            }
        });
    });
    return wordFrequency;
};
function processText(input: string[]) {
    // Remove stop words
    return removeStopwords(input);
}

const convertToWordCloudArray = (wordFrequency:  IFrequencyObj) => Object.entries(wordFrequency).map(([text, textMeta]) => ({ text, textMeta }))
const sortBySize = (data: {text: string; textMeta: tweetMetaType }[]) => data.sort((a, b) => b.textMeta.count - a.textMeta.count);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json');
    const {processedStart, processedEnd} = areDateParamsPresent(req, res);
    try {
        console.time('load-db');
        const db = await getDB();
        console.timeEnd('load-db');
        console.time('fetch-db');
        const wordCloudQuery = `SELECT * FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd};`;
        const result = db.exec(wordCloudQuery);
        console.timeEnd('fetch-db');
        console.time('convert-result');
        const tweets = convertToObjects(result);
        const frequency = calculateFrequency(tweets);
        const freqArray = convertToWordCloudArray(frequency);
        const sortedArray = sortBySize(freqArray);
        console.timeEnd('convert-result');
        res.status(200).json({ data: sortedArray.slice(0, 100), success: true })
    }
    catch (e) {
        const errorMessage = getErrorMessage(e);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /word-cloud' });
    }
}
