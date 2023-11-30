import { NextApiRequest, NextApiResponse } from "next"
import {getErrorMessage} from "../../utils/common";
import getDB from "../../utils/db";
import {areDateParamsPresent, convertToObjects} from "../../utils/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const db = await getDB();
    const {processedStart, processedEnd} = areDateParamsPresent(req, res);
    const topLimit = req.query.top ?? 3;
    const topInteractedTweets = `SELECT id, link, content, retweets + favorites AS totalInteractions FROM tweets WHERE date >= ${processedStart} AND date <= ${processedEnd} ORDER BY totalInteractions DESC LIMIT ${topLimit}`;
    const result = db.exec(topInteractedTweets);
    const topTweets = convertToObjects(result);
    res.status(200).json({ success: true, data: topTweets })
  }  catch (e) {
    const errorMessage = getErrorMessage(e);
    res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /most-interacted' });
  }
}
