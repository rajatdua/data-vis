
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