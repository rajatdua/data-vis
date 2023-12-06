import { Parser } from 'json2csv';
import { NextApiRequest, NextApiResponse } from "next"
import {getErrorMessage} from "../../utils/common";
import prisma from "../../utils/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = (req.query?.type ?? '').toString();
  try {
    const jsonData = req.body?.content ?? {};
    const parser = new Parser();
    let csv = null;
    res.setHeader('Content-Type', 'text/csv');
    let fileName = '';
    switch (type) {
      case 'word-cloud':
        const meta = req.body?.meta ?? { word: '', count: '' };
        fileName=`tweets-${meta.word}-${meta.count}.csv`
        const tweetsByIds = await prisma.tweet.findMany({
          where: {
            id: {
              in: jsonData,
            },
          },
          select: {
            id: true,
            link: true,
            content: true,
          },
        });
        const updatedTweets = tweetsByIds.map((tweet: { id: string, link: string, content: string }) => ({ ...tweet, word: meta.word, frequency: meta.count }))
        csv = parser.parse(updatedTweets);
        break;
      case 'sentiment': {
        const meta = req.body?.meta ?? { type: '' };
        const tweetsByIds = await prisma.tweet.findMany({
          where: {
            id: {
              in: jsonData,
            },
          },
          select: {
            id: true,
            sentiment: true,
            link: true,
            content: true,
          },
        });
        const updatedTweets = tweetsByIds.map((tweet: { id: string, link: string, sentiment: number, content: string }) => ({ ...tweet, type: meta.type }))
        fileName=`sentiment-${meta.type}.csv`
        csv = parser.parse(updatedTweets);
      }
      break;
      case 'tweet-time-map': {
        const tweetsByIds = await prisma.tweet.findMany({
          where: {
            id: {
              in: jsonData,
            },
          },
          select: {
            id: true,
            link: true,
            content: true,
          },
        });
        fileName=`tweet-time-map.csv`
        csv = parser.parse(tweetsByIds);
      }
      break;
    }
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(200).json({ data: csv, fileName: fileName });
  }
  catch (e) {
    const errorMessage = getErrorMessage(e);
    res.status(500).json({error: errorMessage, success: false, message: `error whilst calling /export for ${type}`});
  }
}
