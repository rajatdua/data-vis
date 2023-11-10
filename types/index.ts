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
}

export type tweetMetaType = { count: number, tweets: string[] }

export interface IFetchWordData {
    text: string;
    textMeta: tweetMetaType;
}
export interface IFetchWordReq {
    data?: IFetchWordData[]
}

export interface IFrequencyObj { [key: string]: tweetMetaType }


export type ID3Object = {
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