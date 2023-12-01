import {PrismaClient} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import {env} from "../../env.mjs";
import {getErrorMessage} from "../../utils/common";
import getDB from "../../utils/db";
import {areDateParamsPresent, convertToObjects} from "../../utils/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  const {processedStart, processedEnd} = areDateParamsPresent(req, res);
  switch (env.DATABASE_VERSION) {
    case 1:
    default:
      try {
        const db = await getDB();
        const tweetTimeMapQuery = `SELECT id, time_after, time_before FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd} AND time_after BETWEEN 2 AND 80000 AND time_before BETWEEN 2 AND 80000;`;
        const result = db.exec(tweetTimeMapQuery);
        const tweetsTimes = convertToObjects(result, /* { renameColumn: { time_after: 'timeAfter', time_before: 'timeBefore' } }*/);
        res.status(200).json({ success: true, data: tweetsTimes })
      }
      catch (e) {
        const errorMessage = getErrorMessage(e);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /word-cloud' });
      }
      break;
    case 2: {
      const prisma = new PrismaClient();
      try {
        const tweetsFiltered = await prisma.tweet.findMany({
          where: {
            date: {
              gte: processedStart,
              lte: processedEnd,
            },
            time_after: {
              gte: 2,
              lte: 80000,
            },
            time_before: {
              gte: 2,
              lte: 80000,
            },
          },
          select: {
            id: true,
            time_after: true,
            time_before: true,
          },
        });
        res.status(200).json({ success: true, data: tweetsFiltered })
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /word-cloud' });
      } finally {
        await prisma.$disconnect();
      }
    }
      break;
  }
}
