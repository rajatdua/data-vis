import {DateValueType} from "react-tailwindcss-datepicker";

export interface ICandidate {
    id: string;
    name: string;
    affiliation: string;
    color: string;
    value: string;
    status: string;
}
export interface IRCPAvg {
    candidate: ICandidate[];
    date: string;
}

export interface IDataPoint {
    date: string;
    candidate: ICandidate[];
}

export interface IFetchData {
    rcp_avg?: IRCPAvg[];
    id?: string;
    state?: string;
    title?: string;
    link?: string;
}

export interface IFetchReq {
    data?: IFetchData
}

export interface ICommonChartProps {
    date: DateValueType;
    refreshCount: number;
    updateDateRange: (date: DateValueType) => void
    resetDateRange?: () => void
    version2?: boolean;
}

export type tweetMetaType = { count: number, tweets: string[] }

export interface IInterimWordData { text: string, value: number }

export interface IFetchWordData {
    text: string;
    textMeta: tweetMetaType;
}
export interface IFetchWordReq {
    data?: IFetchWordData[]
}

export interface IFetchTweetMapData {
    id: string;
    timeAfter: number,
    timeBefore: number
}

export interface IFetchTweetMapReq {
    data?: IFetchTweetMapData[]
}

export interface IFetchTweetData {
    content: string;
}

export interface IFetchTweetReq {
    data?: IFetchTweetData[]
}

export interface IFrequencyObj { [key: string]: tweetMetaType }


export interface ID3Object {
    text: string
    size: number
    font: string
    style: string
    weight: string
    rotate: number
    padding: number
    x: number
    y: number
    width: number
    height: number
    xoff: number
    yoff: number
    x1: number
    y1: number
    x0: number
    y0: number
    hasText: boolean
}