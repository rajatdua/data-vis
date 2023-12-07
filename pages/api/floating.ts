import {NextApiRequest, NextApiResponse} from "next"
import {SqlValue} from "sql.js";
import {generateSentiment} from "./sentiment";
import {generateWordCloud} from "./word-cloud";
import {IChartData} from "../../types";
import {getErrorMessage} from "../../utils/common";
import prisma from "../../utils/prisma";
import {areDateParamsPresent} from "../../utils/server";

const getSelectFields = (graph: string) => {
  const common = {id: true, content: true};
  let selected = {};
  switch (graph) {
    case 'sentiment':
      selected = {sentiment: true}
      break;
    case 'word-cloud':
      selected = {}
      break;
    case 'top-interacted':
      selected = { link: true }
      break;
    case 'tweet-time-map':
      selected = {time_after: true, time_before: true}
      break;
  }
  return {
    ...common,
    ...selected
  }
};

const getWhereClause = (graph: string) => {
  switch (graph) {
    case 'tweet-time-map':
      return {
        time_after: {
          gte: 2,
          lte: 80000,
        },
        time_before: {
          gte: 2,
          lte: 80000,
        },
      }
    default:
      return {};
  }
};

interface IGetGraphOpts {
  processedStart: number,
  processedEnd: number,
  isRaw: boolean,
  topLimit: number,
  ids: string[]
}

const getDataForGraph = async (graph: string, opts: IGetGraphOpts) => {
  const {processedStart, processedEnd, isRaw = false, topLimit, ids = [] } = opts;
  const selectFields = getSelectFields(graph);
  const whereClause = getWhereClause(graph);
  let tweetsFiltered: FlatArray<{ [p: string]: SqlValue }[][], 1>[] = [];
  if (isRaw) {
    // let idClauseString = '';
    // ids.forEach((id, index) => {
    //   idClauseString = idClauseString + `id = ${id}${ids.length - 1 === index ? '' : ' OR '}`
    // });
    // console.log(`SELECT id, link, content, retweets, favorites FROM Tweet WHERE id IN (${ids.join(', ')}) AND (date >= ${processedStart} AND date <= ${processedEnd}) ORDER BY retweets + favorites DESC LIMIT ${topLimit}`);
    tweetsFiltered = await prisma.tweet.findMany({
      where: {
        id: {
          in: ids,
        },
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
   // tweetsFiltered = await prisma.$queryRaw`SELECT id, link, content, retweets, favorites FROM Tweet WHERE id IN (${ids.join(', ')}) AND (date >= ${processedStart} AND date <= ${processedEnd}) ORDER BY retweets + favorites DESC LIMIT ${topLimit}`;
  }
  else {
    tweetsFiltered = await prisma.tweet.findMany({
      where: {
        ...(ids.length > 0 ? {
          id: {
            in: ids,
          },
        } : {}),
        date: {
          gte: processedStart,
          lte: processedEnd,
        },
        ...whereClause
      },
      select: {
        ...selectFields,
      },
    });
  }
  switch (graph) {
    case 'sentiment':
      return generateSentiment(tweetsFiltered);
    case 'word-cloud':
      return generateWordCloud(tweetsFiltered, '2');
    case 'top-interacted': {
      return tweetsFiltered.map((tweet) => {
        const { retweets, favorites } = tweet;
        if (typeof retweets === 'number' && typeof favorites === 'number') {
          return {
            ...tweet,
            totalInteractions: retweets + favorites
          }
        } else {
          return tweet;
        }
      });
    }
    case 'tweet-time-map':
      return tweetsFiltered;
    default:
      return {};
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  const {processedStart, processedEnd} = areDateParamsPresent(req, res);
  const graphsToProcess = (req.query?.graphs ?? '').toString().split(',');
  const body = JSON.parse(req.body) as { ids: string[] };
  const { ids = [] } = body;
  const finalData: {[key: string]: IChartData} = {};
  const opts: IGetGraphOpts = {
    processedEnd,
    processedStart,
    isRaw: false,
    topLimit: 3,
    ids
  }
  try {
    for (const graph of graphsToProcess) {
      opts.isRaw = graph === 'top-interacted';
      finalData[graph] = {
        content: await getDataForGraph(graph, opts),
      };
    }
    res.status(200).json({ data: finalData, success: true })
  } catch (e) {
    const errorMessage = getErrorMessage(e);
    res.status(500).json({error: errorMessage, success: false, message: `error whilst calling /floating for ${graphsToProcess}`});
  }
}
