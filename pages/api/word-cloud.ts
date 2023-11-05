import {NextApiRequest, NextApiResponse} from "next";
import {QueryExecResult, SqlValue} from "sql.js";
import {removeStopwords} from 'stopword';
import getDB from '../../utils/db';
import {areDateParamsPresent} from "../../utils/server";

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

const calculateFrequency = (dataArray: FlatArray<{ [p: string]: SqlValue }[][], 1>[]) => {
    const wordFrequency: { [key: string]: number } = {};

    dataArray.forEach((item) => {
        // Tokenize the content
        const content: SqlValue | undefined = (item?.content ?? '').toString();
        const linksRegex = /https?:\/\/\S+/g;
        const mentionsRegex = /@([a-zA-Z0-9_]+)/g;
        const hashtagsRegex = /#([a-zA-Z0-9_]+)/g;
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/g;

        const words = content.toLowerCase().split(/\s+/);
        const filteredWords = words.map((word) => {
            return word
                .replace(linksRegex, '')  // Remove links
                .replace(mentionsRegex, '')  // Remove mentions
                .replace(hashtagsRegex, '')  // Remove hashtags
                .replace(specialCharsRegex, ' ') // Remove special characters
        })
        const processedWords = processText(filteredWords);
        processedWords.forEach((word: string) => {
            if (!wordFrequency[word]) {
                wordFrequency[word] = 1;
            } else {
                wordFrequency[word]++;
            }
        });
    });
    return wordFrequency;
};
function processText(input: string[]) {
    // Remove stop words
    return removeStopwords(input);
}

function convertToWordCloudArray(wordFrequency:  { [key: string]: number }) {
    return Object.entries(wordFrequency).map(([text, size]) => ({ text, size }));
}

const sortBySize = (data: {text: string; size: number }[]) => data.sort((a, b) => b.size - a.size);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json');
    const {processedStart, processedEnd} = areDateParamsPresent(req, res);
    try {
        const db = await getDB();
        const wordCloudQuery = `SELECT * FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd};`;
        const result = db.exec(wordCloudQuery);
        const tweets = convertToObjects(result);
        const frequency = calculateFrequency(tweets);
        const freqArray = convertToWordCloudArray(frequency);
        const sortedArray = sortBySize(freqArray);
        res.status(200).json({ data: sortedArray, success: true })
    }
    catch (e) {
        res.status(500).json({ error: e, success: false });
    }
}
