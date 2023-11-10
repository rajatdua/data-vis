import * as d3 from 'd3';
import cloud from 'd3-cloud';
import React, { useEffect, useRef } from 'react';
import {ID3Object, IFetchWordData} from "../../types";


interface Props {
    data: IFetchWordData[]
    handleWordClick: (event: PointerEvent, d3Object: ID3Object) => void
}

const WordCloud: React.FC<Props> = ({ data, handleWordClick }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const words = data.map(item => ({
            text: item.text,
            size: Math.sqrt(item.textMeta.count)
        }));

        console.log({ words });

        function draw(words: IFetchWordData[]) {
            const svg = d3.select(svgRef.current);

            svg.selectAll('*').remove();

            svg
                .attr('width', layout.size()[0])
                .attr('height', layout.size()[1])
                .append('g')
                .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
                .selectAll('text')
                .data(words)
                .enter().append('text')
                .style('font-size', (d: { size: number }) => d.size + 'px')
                .style('fill', '#000') // Change this to adjust the color of your words
                .attr('text-anchor', 'middle')
                .on('click', handleWordClick) // Add click event handler
                .attr('cursor', 'pointer') // Change cursor to indicate clickable
                .attr('transform', (d: { x: number; y: number; rotate: number; }) => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
                .text((d: { text: string }) => d.text);
        }

        const layout = cloud()
            .size([1400, 600])
            .words(words)
            .padding(10)
            .rotate(() => 0)
            // .rotate(() => ~~(Math.random() * 2) * 90)
            .fontSize((d: { size: number }) => d.size)
            .on('end', draw);

        layout.start();


    }, [data]);

    return <svg ref={svgRef} />;
}

export default WordCloud;
