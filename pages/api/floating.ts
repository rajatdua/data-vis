import {NextApiRequest, NextApiResponse} from "next"
import {SqlValue} from "sql.js";
import {generateSentiment} from "./sentiment";
import {generateWordCloud} from "./word-cloud";
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
}

const getDataForGraph = async (graph: string, opts: IGetGraphOpts) => {
  const {processedStart, processedEnd, isRaw = false, topLimit } = opts;
  const selectFields = getSelectFields(graph);
  const whereClause = getWhereClause(graph);
  let tweetsFiltered: FlatArray<{ [p: string]: SqlValue }[][], 1>[] = [];
  if (isRaw) {
    tweetsFiltered = await prisma.$queryRaw`
        SELECT id, link, content, retweets, favorites
        FROM Tweet
        WHERE date >= ${processedStart}
            AND date <= ${processedEnd}
        ORDER BY retweets + favorites DESC
        LIMIT ${topLimit}`;
  }
  else {
    tweetsFiltered = await prisma.tweet.findMany({
      where: {
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

function isKey<T extends object>(
  x: T,
  k: PropertyKey
): k is keyof T {
  return k in x;
}

interface IChartData {
  content: unknown,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  const {processedStart, processedEnd} = areDateParamsPresent(req, res);
  const graphsToProcess = (req.query?.graphs ?? '').toString().split(',');
  const finalData: {[key: string]: IChartData} = {};
  const opts: IGetGraphOpts = {
    processedEnd,
    processedStart,
    isRaw: false,
    topLimit: 3,
  }

  for (const graph of graphsToProcess) {
    if (isKey(finalData, graph)) {
      opts.isRaw = graph === 'top-interacted';
      finalData[graph] = {
        content: await getDataForGraph(graph, opts),
      };
    }
  }
  res.status(200).json({ data: finalData, success: true })
}
