import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from "next"
import {Simulate} from "react-dom/test-utils";
import {env} from "../../env.mjs";
import {getErrorMessage} from "../../utils/common";
import getDB from "../../utils/db";
import {areDateParamsPresent, convertToObjects} from "../../utils/server";

interface Tweet {
  id: string;
  link: string;
  content: string;
  retweets: number;
  favorites: number;}
interface TweetWithInteractions extends Tweet {
  totalInteractions: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  const {processedStart, processedEnd} = areDateParamsPresent(req, res);
  const topLimit = parseInt((req.query.top ?? 3).toString());
  switch (env.DATABASE_VERSION) {
    case 1:
    default:
      try {
        const db = await getDB();
        const topInteractedTweets = `SELECT id, link, content, retweets + favorites AS totalInteractions FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd} ORDER BY totalInteractions DESC LIMIT ${topLimit}`;
        const result = db.exec(topInteractedTweets);
        const topTweets = convertToObjects(result);
        res.status(200).json({success: true, data: topTweets})
      } catch (e) {
        const errorMessage = getErrorMessage(e);
        res.status(500).json({error: errorMessage, success: false, message: 'error whilst calling /most-interacted'});
      }
      break;
    case 2: {
      const prisma = new PrismaClient();
      try {
        // const topTweets =  await prisma.$queryRaw`
        // SELECT id, link, content, retweets + favorites AS totalInteractions
        // FROM Tweet
        // WHERE date >= ${processedStart}
        //     AND date <= ${processedEnd}
        // ORDER BY totalInteractions DESC
        // LIMIT ${topLimit}`;
        const topTweets = await prisma.tweet.findMany({
          where: {
            date: {
              gte: processedStart,
              lte: processedEnd
            }
          },
          orderBy: [
            {retweets: 'desc'},
            {favorites: 'desc'}
          ],
          take: topLimit,
          select: {
            id: true,
            link: true,
            content: true,
            retweets: true,
            favorites: true
          }
        })

        // Calculate total interactions
        const updatedTopTweets: TweetWithInteractions[] = topTweets.map(tweet => {
          return {
            ...tweet,
            totalInteractions: tweet.retweets + tweet.favorites
          }
        })
        res.status(200).json({success: true, data: updatedTopTweets})
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(500).json({error: errorMessage, success: false, message: 'error whilst calling /most-interacted'});
      } finally {
        await prisma.$disconnect();
      }
    }
  }
}