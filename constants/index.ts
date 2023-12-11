import React from "react";

export const START_DATE_ALL = '2014-06-01';
export const START_DATE = '2015-07-01';
export const END_DATE = '2016-11-08';
export const END_DATE_ALL = '2018-11-01';

export const INIT_SENTIMENT = { positive: { count: 0, tweets: [] }, negative: { count: 0, tweets: [] }, neutral: { count: 0, tweets: [] } }

export const INIT_DASHBOARD = {
    id: '',
    title: '',
    description: '',
    tweetIds: [],
    graphsToRender: {},
    depth: 0,
};

export const INIT_SELECTED_TWEET = {
    id: '',
    link: '',
    content: '',
    totalInteractions: 0
};

export const INIT_PINNED = { id: '', node: React.createElement('div', null), dashboard: INIT_DASHBOARD, isPinned: false, isPinnedOptions: false, chartTitle: '' }

const CONSTANTS = {
    START_DATE,
    END_DATE,
    INIT_SENTIMENT,
    INIT_SELECTED_TWEET,
    INIT_PINNED,
}
export default CONSTANTS;