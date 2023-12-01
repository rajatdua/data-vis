// import { parse, write } from 'fast-csv';
// import natural from 'natural';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from "next"
import {SqlValue} from "sql.js";
import {env} from "../../env.mjs";
// import fs from "fs";
// import path from "path";
import {getErrorMessage} from "../../utils/common";
import getDB from "../../utils/db";
import {areDateParamsPresent, convertToObjects /*, preProcessContent */ } from "../../utils/server";

// const instance = new SentimentManager();
// const Sentianalyzer =
//   new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');


// Function to calculate sentiment score
// function calculateSentimentScore(tweet: string) {
//   return Sentianalyzer.getSentiment(preProcessContent(tweet).split(' '));
// }

// Function to update CSV file with sentiment column
// function updateCSV(inputFilePath: string, outputFilePath: string) {
//   const rows = [];
//
//   // Read the CSV file
//   fs.createReadStream(inputFilePath)
//     .pipe(parse({ headers: true }))
//     .on('data', (row) => {
//       // Calculate sentiment score for each tweet
//       row.sentiment = calculateSentimentScore(row.content);
//       rows.push(row);
//     })
//     .on('end', () => {
//       // Write the updated data to a new CSV file
//       const writeStream = fs.createWriteStream(outputFilePath);
//       write(rows, { headers: true })
//         .pipe(writeStream)
//         .on('finish', () => {
//           console.log('CSV file updated successfully with sentiment column.');
//         });
//     });
// }


function analyzeSentiment(score: number): string {
  if (score < -0.25) return 'negative';
  if (score > 0.25) return 'positive';
  return 'neutral';
}

const generateSentiment = (tweets: FlatArray<{ [p: string]: SqlValue }[][], 1>[]) => {
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  const tweetsList: { positive: string[], neutral: string[], negative: string[] } = { positive: [], neutral: [], negative: [] };

  for (const tweet of tweets) {
    const { sentiment: sentimentValue = 0, id: tweetId = '' } = tweet;
    const sentiment: "positive" | "neutral" | "negative" = analyzeSentiment(parseFloat(String(sentimentValue))) as "positive" | "neutral" | "negative";
    sentimentCounts[sentiment]++;
    tweetsList[sentiment].push((tweetId ?? '').toString());
  }

  return ({
    positive: { count: sentimentCounts.positive, tweets: tweetsList.positive },
    negative: { count: sentimentCounts.negative, tweets: tweetsList.negative },
    neutral: { count: sentimentCounts.neutral, tweets: tweetsList.neutral },
  });

};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Update CSV file
  // const inputFilePath = path.resolve(process.cwd(), 'pages/api/tweets_with_time_diff.csv');
  // const outputFilePath = path.resolve(process.cwd(), 'pages/api/tweets_with_time_diff_senti.csv');
  // updateCSV(inputFilePath, outputFilePath);
  res.setHeader('Content-Type', 'application/json');
  const {processedStart, processedEnd} = areDateParamsPresent(req, res);
  switch (env.DATABASE_VERSION) {
    default:
    case 1:
      try {
        const db = await getDB();
        const sentimentTweets = `SELECT id, sentiment FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd};`;
        const result = db.exec(sentimentTweets);
        const tweetsWithSentiment = convertToObjects(result);
        const sentimentData = generateSentiment(tweetsWithSentiment);
        res.status(200).json({ success: true, data: sentimentData })
      }
      catch (e) {
        const errorMessage = getErrorMessage(e);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /sentiment' });
      }
    break;
    case 2: {
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
            sentiment: true,
          },
        });
        res.status(200).json({ success: true, data: generateSentiment(tweetsInRange) })
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /sentiment' });
      } finally {
        await prisma.$disconnect();
      }
    }
  }
}
