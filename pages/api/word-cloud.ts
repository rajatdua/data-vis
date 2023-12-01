import {PrismaClient} from "@prisma/client";
import {isEmpty} from "lodash";
import {NextApiRequest, NextApiResponse} from "next";
import {SqlValue} from "sql.js";
import {removeStopwords} from 'stopword';
import {env} from "../../env.mjs";
import {IFrequencyObj, tweetMetaType} from "../../types";
import {getErrorMessage} from "../../utils/common";
import getDB from '../../utils/db';
import {areDateParamsPresent, convertToObjects, preProcessContent /*, saveToJsonFile*/} from "../../utils/server";

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

const calculateFrequency = (dataArray: FlatArray<{ [p: string]: SqlValue }[][], 1>[], version = 1) => {
    const wordFrequency: IFrequencyObj = {};

    dataArray.forEach((item) => {
        // Tokenize the content
        const content: SqlValue | undefined = (item?.content ?? '').toString().toLowerCase();
        let processedWords: string[] = []
        if (version === 1) {
            const cleanedContent = filterOne(content);
            const words = cleanedContent.split(/\s+/);
            const filteredWords = words.filter(word => word !== '');
            processedWords = processText(filteredWords);
        }
        else if (version === 2) {
            const processedContent = preProcessContent(content);
            processedWords = processedContent.split(/\s+/);
        }
        processedWords.forEach((word: string) => {
            if (isEmpty(wordFrequency[word])) {
                wordFrequency[word] = {
                    count: 1,
                    tweets: [content]
                };
            } else {
                wordFrequency[word] = {
                    count: wordFrequency[word].count + 1,
                    tweets: wordFrequency[word].tweets.length <= 10 ? [...wordFrequency[word].tweets, content] : wordFrequency[word].tweets
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
    const selectedVersion = (req.query?.version ?? '1').toString();
    switch (env.DATABASE_VERSION) {
        case 1:
        default:
            try {
                const db = await getDB();
                const wordCloudQuery = `SELECT * FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd};`;
                const result = db.exec(wordCloudQuery);
                const tweets = convertToObjects(result);
                const frequency = calculateFrequency(tweets, parseInt(selectedVersion));
                const freqArray = convertToWordCloudArray(frequency);
                const sortedArray = sortBySize(freqArray);
                res.status(200).json({ data: sortedArray.slice(0, 100), success: true })
            }
            catch (e) {
                const errorMessage = getErrorMessage(e);
                res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /word-cloud' });
            }
            break;
        case 2:
        {
            const prisma = new PrismaClient();
            try {
                const tweetsInRange = await prisma.tweet.findMany({
                    where: {
                        date: {
                            gte: processedStart,
                            lte: processedEnd,
                        },
                    },
                    select: {
                        id: true,
                        content: true,
                    },
                });
                const frequency = calculateFrequency(tweetsInRange, parseInt(selectedVersion));
                const freqArray = convertToWordCloudArray(frequency);
                const sortedArray = sortBySize(freqArray);
                res.status(200).json({ success: true, data: sortedArray.slice(0, 100) })
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /word-cloud' });
            } finally {
                await prisma.$disconnect();
            }
        }

    }
}
