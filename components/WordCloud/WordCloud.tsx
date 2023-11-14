import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { schemeCategory10 } from 'd3-scale-chromatic'; // Import color palette from d3
import React, { useEffect, useRef } from 'react';
import {ID3Object, IFetchWordData} from "../../types";


interface Props {
    data: IFetchWordData[]
    handleWordClick: (d3Object: ID3Object) => void
}

const WordCloud: React.FC<Props> = ({ data, handleWordClick }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const words = data.map(item => ({
            text: item.text,
            size: Math.sqrt(item.textMeta.count)
        }));

        const maxWordSize = d3.max(words, (d) => d.size) || 0; // Use 0 if max size is undefined

        function getRandomColor() {
            // Generate a random color for smaller-sized words
            // return d3.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255).toString();
            return schemeCategory10[Math.floor(Math.random() * schemeCategory10.length)];
        }

        function getColor(size: number) {
            // Use a linear scale to map word size to colors
            // const colorScale = d3.scaleLinear<string>().domain([0, maxWordSize]).range(['#999', '#ff5733']);
            const colorScale = d3.scaleLinear<number>().domain([0, maxWordSize]).range([0, 1]);
            // return d3.interpolateRgb('#999', '#ff5733')(colorScale(size));
            return d3.interpolateRgb(schemeCategory10[0], schemeCategory10[1])(colorScale(size));
        }

        function draw(words: ID3Object[]) {
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
                .style('font-size', (d) => d.size + 'px')
                // .style('fill', '#000') // Change this to adjust the color of your words
              .style('fill', (d) => (d.size > maxWordSize / 2 ? getColor(d.size) : getRandomColor()))

              // .style('fill', d => getColor(d.size)) // Assign color based on word size
                .attr('text-anchor', 'middle')
                .on('click', (_, d) => handleWordClick(d)) // Add click event handler
                .attr('cursor', 'pointer') // Change cursor to indicate clickable
                .attr('transform', (d) => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
                .text((d) => d.text);
        }

        const layout = cloud()
            .size([1080, 600])
            .words(words)
            .padding(10)
            .rotate(() => 0)
            // .rotate(() => ~~(Math.random() * 2) * 90)
            .fontSize((d) => d.size || 22)
            .on('end', draw);

        layout.start();


    }, [data]);

    return <svg ref={svgRef} />;
}

export default WordCloud;
