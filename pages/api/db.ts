import { NextApiRequest, NextApiResponse } from "next"

import fs from 'fs';
import path from "path";
import {env} from "../../env.mjs";
import prisma from "../../utils/prisma";

interface ITweetJSON {
  id: string
  link: string
  content: string
  date: number
  retweets: number
  favorites: number
  mentions: string
  hashtags: string
  time_before: number
  time_after: number
  sentiment: number
}

async function insertDataFromJSON(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.resolve(process.cwd(), 'pages/api/tweets.json');

  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ITweetJSON[];

    // Transform JSON data to Prisma format
    const prismaData = jsonData.map(item => ({
      id: item.id,
      link: item.link,
      content: item.content,
      date: item.date,
      retweets: item.retweets,
      favorites: item.favorites,
      mentions: item.mentions,
      hashtags: item.hashtags,
      time_before: item.time_before,
      time_after: item.time_after,
      sentiment: item.sentiment,
    }));

    // Bulk insert using createMany
    await prisma.tweet.createMany({
      data: prismaData,
    });

    res.status(200).json({ success: true, message: "Bulk data insertion completed." })
  } catch (error) {
    res.status(500).json({ success: false, message: `'Error inserting data:', ${error}` })
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchResults(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tweetCount = await prisma.tweet.count();
    res.status(200).json({ success: true, message: `Total number of rows in the Tweet table: ${tweetCount}`, data: tweetCount })
  } catch (error) {
    res.status(500).json({ success: false, message: `'Error retrieving row count:', ${error}` })
  } finally {
    await prisma.$disconnect();
  }
}




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const operation = req.query.op ?? '';
  switch (operation.toString()) {
    case 'insert':
      await insertDataFromJSON(req, res);
      break;
    case 'fetch':
      await fetchResults(req, res);
      break;
    case 'env':
      res.status(200).json({ success: true, data: env.DATABASE_VERSION })
      break;
    default:
      res.status(500).json({ success: false, message: `wrong operation selected - ${operation}` })
      break;
  }
}
