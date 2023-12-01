import { NextApiRequest, NextApiResponse } from "next"
import {env} from "../../env.mjs";
import {getErrorMessage} from "../../utils/common";
import getDB from "../../utils/db";
import prisma from '../../utils/prisma';
import {convertToObjects} from "../../utils/server";

interface ITweetsReqBody {
  ids: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.status(405).send({ success: false, message: 'Only POST requests allowed' })
    return
  }
  const body = JSON.parse(req.body) as ITweetsReqBody;
  const { ids = [] } = body;
  switch (env.DATABASE_VERSION) {
    default:
    case 1:
      try {
        const db = await getDB();
        const tweetsByIdQuery = `SELECT content FROM tweets WHERE id in (${ids.join(',')});`;
        const result = db.exec(tweetsByIdQuery);
        const tweetsByIds = convertToObjects(result);
        res.status(200).json({ success: true, data: tweetsByIds })
      }  catch (e) {
        const errorMessage = getErrorMessage(e);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /tweets' });
      }
      break;
    case 2: {
      try {
        const tweetsByIds = await prisma.tweet.findMany({
          where: {
            id: {
              in: ids,
            },
          },
          select: {
            content: true,
          },
        });
        res.status(200).json({ success: true, data: tweetsByIds })
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /tweets' });
      } finally {
        await prisma.$disconnect();
      }
    }
  }
}
