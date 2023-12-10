export const START_DATE_ALL = '2014-06-01';
export const START_DATE = '2015-06-01';
export const END_DATE = '2018-06-01';
export const END_DATE_ALL = '2018-11-01';

export const INIT_SENTIMENT = { positive: { count: 0, tweets: [] }, negative: { count: 0, tweets: [] }, neutral: { count: 0, tweets: [] } }

export const INIT_DASHBOARD = {
    id: '',
    title: '',
    tweetIds: [],
    graphsToRender: {}
};

export const INIT_SELECTED_TWEET = {
    id: '',
    link: '',
    content: '',
    totalInteractions: 0
}

const CONSTANTS = {
    START_DATE,
    END_DATE,
    INIT_SENTIMENT,
    INIT_SELECTED_TWEET,
}
export default CONSTANTS;