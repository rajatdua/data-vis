
export const getIndex = (index: number, totalLength: number, selectedSorting: string) => {
  if (checkReverse(selectedSorting)) return index;
  else return (totalLength - 1 - index);
};

export const checkReverse = (selectedSorting: string) => selectedSorting === 'desc';

export const executeReverse = (array: string[], flag: boolean) => flag ? array.toReversed() : array;

export const getColorRange = (lengthOfData: number, selectedSorting: 'asc' | 'desc'): string[] => {
  const shouldReverse = checkReverse(selectedSorting);
  switch (lengthOfData) {
    case 3:
    default:
      return executeReverse(['#f0f0f0',
        '#bdbdbd',
        '#636363'], shouldReverse);
    case 4:
      return executeReverse(['#f7f7f7',
        '#cccccc',
        '#969696',
        '#525252'], shouldReverse);
    case 5:
      return executeReverse(['#f7f7f7',
        '#cccccc',
        '#969696',
        '#636363',
        '#252525'], shouldReverse);
  }
};

export function formatNumber(number: number) {
  const formatter = new Intl.NumberFormat('en-US');
  return formatter.format(number);
}

