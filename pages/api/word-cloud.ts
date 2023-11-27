import {isEmpty} from "lodash";
import natural from 'natural';
import {NextApiRequest, NextApiResponse} from "next";
import normalize from 'normalize-text';
import {SqlValue} from "sql.js";
import {removeStopwords, eng} from 'stopword';
import {IFrequencyObj, tweetMetaType} from "../../types";
import {getErrorMessage} from "../../utils/common";
import getDB from '../../utils/db';
import {areDateParamsPresent, convertToObjects /*, saveToJsonFile*/} from "../../utils/server";
const stemmer = natural.PorterStemmer;

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

const preProcessContent = (content: string) => {
    // 1. Remove formatting: HTML tags
    content = content.replace(/<[^>]*>/g, "");

    // 2. Remove Noise
    content = normalize(content)
    content = content.replace(/(@\s*\w+|#\s*\w+)/g, '')
    content = content.replace(/[’|']s|i'm/g, '')
    content = content.replace(/[^\w\s]|['’"`]/g, '')
    // content = content.replace(/[\u2018\u2019]/g, "'"); // Replace special single-quotes
    // content = content.replace(/[\u201C\u201D]/g, '"'); // Replace special double-quotes
    // content = content.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII chars
    content = content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ''); // Remove URLs


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
    content = stemmer.stem(content);

    // 7. Lemmatization: Natural library doesn't support lemmatization for English.
    // might need to use a Python library like NLTK or SpaCy for this.

    content = content.split(/\s+/).filter(word => word!=='').join(' ')

    return content;

};

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
    try {
        const db = await getDB();
        const wordCloudQuery = `SELECT * FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd};`;
        const result = db.exec(wordCloudQuery);
        const tweets = convertToObjects(result);
        const frequency = calculateFrequency(tweets, parseInt((req.query?.version ?? '1').toString() ?? '1'));
        const freqArray = convertToWordCloudArray(frequency);
        const sortedArray = sortBySize(freqArray);
        res.status(200).json({ data: sortedArray.slice(0, 100), success: true })
    }
    catch (e) {
        const errorMessage = getErrorMessage(e);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /word-cloud' });
    }
}
