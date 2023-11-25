import { NextApiRequest, NextApiResponse } from "next"
import {getErrorMessage} from "../../utils/common";
import getDB from "../../utils/db";
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
  try {
    const db = await getDB();
    const body = JSON.parse(req.body) as ITweetsReqBody;
    const { ids = [] } = body;
    const tweetsByIdQuery = `SELECT content FROM tweets WHERE id in (${ids.join(',')});`;
    const result = db.exec(tweetsByIdQuery);
    const tweetsTimes = convertToObjects(result);
    res.status(200).json({ success: true, data: tweetsTimes })
  }  catch (e) {
    const errorMessage = getErrorMessage(e);
    res.status(500).json({ error: errorMessage, success: false, message: 'error whilst calling /tweets' });
  }
}
