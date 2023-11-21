import { scaleLog, scaleQuantize } from '@visx/scale';
import { Text } from '@visx/text';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import React, {useState} from "react";
import {IInterimWordData} from "../../types";

interface IWordCloudProps {
  words: IInterimWordData[]
  width: number
  handleWordClick: (event: React.MouseEvent) => void
}

type SpiralType = 'archimedean' | 'rectangular';

const WordCloudV2: React.FC<IWordCloudProps> = ({ words, width, handleWordClick }) => {

  const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  // const colors = ['#143059', '#2F6B9A', '#82a6c2'];
  // const colors = ['#82a6c2', '#2F6B9A', '#143059'];
  // const colors = ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee0d2', '#fff5f0'];
  const colors = ['#ef3b2c', '#a50f15', '#67000d'];

  const colorScale = scaleQuantize({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: colors, // Adjust the range based on your color choices
  });

  function getRotationDegree() {
    const rand = Math.random();
    const degree = rand > 0.5 ? 60 : -60;
    return rand * degree;
  }

  const fontSizeSetter = (datum: IWordCloudProps['words'][0]) => fontScale(datum.value);

  const fixedValueGenerator = () => 0.5;

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });
  return (
    <Wordcloud
      words={words}
      width={width}
      height={480}
      fontSize={fontSizeSetter}
      font={'Impact'}
      padding={2}
      spiral={spiralType}
      rotate={withRotation ? getRotationDegree : 0}
      random={fixedValueGenerator}
    >
      {(cloudWords) => {
        return cloudWords.map((w, i) => (
          <Text
            key={w.text}
            // fill={colors[i % colors.length]}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore -- value is part of IWordCloudProps - TODO: extend it with layout.cloud.Word[]
            fill={colorScale(w.value)}
            textAnchor={'middle'}
            transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
            fontSize={w.size}
            fontFamily={w.font}
            onClick={handleWordClick}
          >
            {w.text}
          </Text>
        ))
      }}
    </Wordcloud>
  );
};

export default WordCloudV2;