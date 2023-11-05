import {DateValueType} from "react-tailwindcss-datepicker";

export const createDateQuery = (date: DateValueType, prefix: string = '/') => {
    const selectedStartDate = date?.startDate ?? '';
    const selectedEndDate = date?.endDate ?? '';
    return `${prefix}${selectedStartDate !== '' ? `?start=${selectedStartDate}` : ''}${selectedEndDate !== '' ? `&end=${selectedEndDate}` : ''}`;
};

const CLIENT_FUNCTIONS = {
    createDateQuery
};

export default CLIENT_FUNCTIONS;