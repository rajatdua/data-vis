import { NextApiRequest, NextApiResponse } from "next";
import polls from './polls-2016.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: polls })
}
