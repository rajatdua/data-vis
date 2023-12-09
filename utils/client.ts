import { nanoid } from 'nanoid'
import {DateValueType} from "react-tailwindcss-datepicker";
import {END_DATE, START_DATE} from "../constants";
import {ISetters} from "../store/app";
import {
  IFetchSentimentData,
  IFetchTweetMapData,
  IFetchWordData,
  IGraphReq,
  IRecursiveType,
  MostInteractedTweet
} from "../types";

// Debounce function
export const debounce = <F extends (...args: never[]) => void>(func: F, delay: number): ((...args: Parameters<F>) => void) => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    }
}

export const createDateQuery = (date: DateValueType, prefix = '/', suffix = '') => {
    const selectedStartDate = date?.startDate ?? '';
    const selectedEndDate = date?.endDate ?? '';
    return `${prefix}${selectedStartDate !== '' ? `?start=${selectedStartDate}` : ''}${selectedEndDate !== '' ? `&end=${selectedEndDate}` : ''}${suffix}`;
};

export interface IFloatingOpts extends IRecursiveType {
    date: DateValueType,
}
export interface IComponentOpts {
    setData: () => void
    setLoading: () => void
}

export const fetchFloatingType = async (
  floatingOpts: IFloatingOpts = {date: {startDate: START_DATE, endDate: END_DATE}, ids: [], graphKey: '' },
  componentOpts: {
      setData: (value: (((prevState: unknown[]) => unknown[]) | unknown[])) => void;
      setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void
  }) => {
    const { date, graphKey, ids } = floatingOpts;
    const { setData, setLoading } = componentOpts;
    setLoading(true);
    const query = createDateQuery(date, '/api/floating', `&graphs=${graphKey}`);
    const allGraphData = await (await fetch(query, { method: 'POST', body: JSON.stringify({ ids: ids }) })).json() as IGraphReq
    const fetchedData = allGraphData?.data ?? {};
    switch (graphKey) {
        case 'tweet-time-map': {
          const selectedGraphData = fetchedData[graphKey]?.content as unknown as IFetchTweetMapData[];
          const typeCastedSetData = setData as (value: (((prevState: IFetchTweetMapData[]) => IFetchTweetMapData[]) | IFetchTweetMapData[])) => void
          typeCastedSetData(selectedGraphData);
        }
            break;
      case 'word-cloud': {
        const selectedGraphData = fetchedData[graphKey]?.content as unknown as IFetchWordData[];
        const typeCastedSetData = setData as (value: (((prevState: IFetchWordData[]) => IFetchWordData[]) | IFetchWordData[])) => void
        typeCastedSetData(selectedGraphData);
      }
        break;
      case 'sentiment': {
        const selectedGraphData = fetchedData[graphKey]?.content as unknown as IFetchSentimentData[];
        const typeCastedSetData = setData as (value: (((prevState: IFetchSentimentData[]) => IFetchSentimentData[]) | IFetchSentimentData[])) => void
        typeCastedSetData(selectedGraphData);
      }
      break;
      case 'top-interacted': {
        const selectedGraphData = fetchedData[graphKey]?.content as unknown as MostInteractedTweet[];
        const typeCastedSetData = setData as (value: (((prevState: MostInteractedTweet[]) => MostInteractedTweet[]) | MostInteractedTweet[])) => void
        typeCastedSetData(selectedGraphData);
      }
        break;

    }
    setLoading(false);
};

export interface IDashboardGraphs {
  [key: string]: boolean
}

export interface IDashboardMeta {
  date: DateValueType,
  container: string,
}

export const createDashboard = (tweetIds: string[], graphs: IDashboardGraphs, meta: IDashboardMeta, setters: ISetters) => {
  const { date, container } = meta;
  const { setTitle, setGraphToRender, setTweetIds } = setters;
  const dashboardId = nanoid();
  const title = `Dashboard: ${dashboardId} - ${container} (${date?.startDate} - ${date?.endDate})`;
  setTitle(dashboardId, title);
  Object.entries(graphs).forEach(([type, value]) => {
    setGraphToRender(dashboardId, { type, value });
  })
  setTweetIds(dashboardId, tweetIds);
};

const CLIENT_FUNCTIONS = {
    createDateQuery,
    debounce,
    fetchFloatingType,
};

export default CLIENT_FUNCTIONS;