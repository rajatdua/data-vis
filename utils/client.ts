import {DateValueType} from "react-tailwindcss-datepicker";

// Debounce function
export const debounce = <F extends (...args: never[]) => void>(func: F, delay: number): ((...args: Parameters<F>) => void) => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    }
}

export const createDateQuery = (date: DateValueType, prefix = '/') => {
    const selectedStartDate = date?.startDate ?? '';
    const selectedEndDate = date?.endDate ?? '';
    return `${prefix}${selectedStartDate !== '' ? `?start=${selectedStartDate}` : ''}${selectedEndDate !== '' ? `&end=${selectedEndDate}` : ''}`;
};

const CLIENT_FUNCTIONS = {
    createDateQuery,
    debounce,
};

export default CLIENT_FUNCTIONS;