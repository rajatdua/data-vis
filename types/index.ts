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

export interface IFetchWordData {
    text: string;
    size: number;
}
export interface IFetchWordReq {
    data?: IFetchWordData[]
}