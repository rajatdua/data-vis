import * as d3 from "d3";
import React, {useEffect, useRef} from "react";
import {SentimentItem} from "../../types";

interface IColumnChartProps {
  data: SentimentItem[]
  onChartRender: () => void
  width: number
}

function getColor(group: string): string {
  switch (group) {
    case 'negative':
      return '#e9a3c9';
    case 'neutral':
      return '#f7f7f7';
    case 'positive':
      return '#a1d76a';
    default:
      return '#ccc';
  }
}

const ColumnChart: React.FC<IColumnChartProps> = ({ data, onChartRender, width = 600 }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const total = data.reduce((acc, item) => { return acc + item.value.count}, 0);
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    // set the dimensions and margins of the graph
    // const width = 400; // Adjust the width as needed
    const height = 400; // Adjust the height as needed
    const margin = { top: 20, right: 20, bottom: 30, left: 80 };

// append the svg object to the body of the page
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const maxValue = d3.max(data, (d) => d.value.count) || 0;

    // Determine a suitable interval dynamically based on the maximum value
    const interval = Math.pow(10, Math.floor(Math.log10(maxValue))); // Calculate order of magnitude
    const adjustedMaxValue = Math.ceil(maxValue / interval) * interval;

    // Define colors
    // const colorScale = d3
    //   .scaleOrdinal<string>()
    //   .domain(data.map((d) => d.group))
    //   .range(['#e9a3c9', '#f7f7f7', '#a1d76a']);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.group))
      .range(data.map((d) => getColor(d.group)));

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.group))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, adjustedMaxValue])
      .range([height - margin.bottom, margin.top]);


    // const yAxisGrid = d3.axisLeft(yScale).tickSize(-width).ticks(10);

    // yAxisGrid.tickValues(yScale.ticks(10).filter((tick) => tick !== 0 && tick !== adjustedMaxValue));


    // Draw y-axis

    // svg.append('g')
    //   .attr('transform', `translate(${margin.left}, 0)`)
    //   .style('font-size', '0')
    //   .call(yAxisGrid)
    //   .selectAll('line')
    //   .filter((_, i, nodes) => {
    //     // Filter out the lines corresponding to 0 and maxValue
    //     const tickValue = d3.select(nodes[i]).datum();
    //     return tickValue !== 0 && tickValue !== adjustedMaxValue;
    //   })
    //   .style('stroke-dasharray', '2, 2') // Dotted line style
    //   .style('stroke', '#eee'); // Color of the grid lines


    // Create a group for each bar (rectangle + text)
    const barGroups = svg
      .selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(${xScale(d.group)}, 0)`);

// Draw bars
    barGroups
      .append('rect')
      .attr('y', (d) => yScale(d.value.count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScale(d.value.count))
      .attr('fill', (d) => colorScale(d.group))
      .attr('stroke', 'black') // Border color
      .attr('stroke-width', 1); // Border width

// Add text labels in the middle of each bar
    barGroups
      .append('text')
      .attr('x', xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.value.count) - 5) // Adjust the vertical position
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text((d) => d.value.count);

    barGroups
      .append('text')
      .attr('x', xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.value.count) + 20) // Adjust the vertical position
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text((d) => `${d.value.count === 0 ? '' : `${((d.value.count/total) * 100).toFixed(2)}%`}`);


    // Draw x-axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .style('font-size', '12px')
        .call(d3.axisBottom(xScale));

    // Draw y-axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .style('font-size', '12px')
        .call(d3.axisLeft(yScale));

    svg.append('g')
      .attr('transform', 'translate(' + 25 + ', ' + height/2 + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .style('font-size', '14px')
      // .attr('dy', '1em')
      .text('Tweet Instances');


      d3.select('#column-chart')
      .on('end', onChartRender);

      // Cleanup
      return () => {
        svg.selectAll('*').remove();
      };

  }, [data]);
  return <svg id='column-chart' ref={ref}/>;
};

export default ColumnChart;