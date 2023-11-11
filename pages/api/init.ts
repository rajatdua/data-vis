import {NextApiRequest, NextApiResponse} from "next"
import {getErrorMessage} from "../../utils/common";
import getDB from "../../utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getDB();
        res.status(200).json({success: true, message: 'db initialised'})
    } catch (e) {
        const errorMessage = getErrorMessage(e);
        res.status(500).json({success: false, message: 'db failed initialised', error: errorMessage })
    }
}
