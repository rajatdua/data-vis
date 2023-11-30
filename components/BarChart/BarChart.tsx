import * as d3 from "d3";
import React, {useEffect, useRef} from "react";
import {MostInteractedTweet} from "../../types";

interface IBarChartProps {
  data: MostInteractedTweet[]
  onChartRender: () => void
  handleBarClick: (event: React.MouseEvent, datum: MostInteractedTweet) => void
  width: number
}

const getColorRange = (lengthOfData: number): string[] => {
  switch (lengthOfData) {
    case 3:
    default:
      return ['#f0f0f0',
      '#bdbdbd',
      '#636363'];
    case 4:
      return ['#f7f7f7',
      '#cccccc',
      '#969696',
      '#525252'];
    case 5:
      return ['#f7f7f7',
      '#cccccc',
      '#969696',
      '#636363',
      '#252525'];
  }
};

function formatNumber(number: number) {
  const formatter = new Intl.NumberFormat('en-US');
  return formatter.format(number);
}

const BarChart: React.FC<IBarChartProps> = ({ data, onChartRender, width = 600, handleBarClick }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 80 };

    svg
      // .attr("width", width + margin.left + margin.right)
      .attr("width", width + (margin.right/2))
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const maxValue = d3.max(data, (d) => d.totalInteractions) || 0;

    const interval = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const adjustedMaxValue = Math.ceil(maxValue / interval) * interval;

    const colorScale = d3.scaleLinear<string>()
    .domain(data.map(tweet => tweet.totalInteractions))
    .range(getColorRange(data.length));

    const yScale = d3
      .scaleBand<number>()
      .domain(data.map((_, index) => index))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const xScale = d3
      .scaleLinear()
      .domain([0, adjustedMaxValue])
      .range([margin.left, width - margin.right]);

    const barGroups = svg
      .selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (_, index) => `translate(0, ${yScale(index)})`);

    barGroups
      .append('rect')
      .attr('x', margin.left)
      .attr('width', (d) => xScale(d.totalInteractions) - margin.left)
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScale(d.totalInteractions))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .on('click', handleBarClick);

    barGroups
      .append('text')
      .attr('x', (d) => xScale(d.totalInteractions) + 5)
      .attr('y', yScale.bandwidth() / 2)
      .attr('text-anchor', 'start')
      .attr('dy', '0.35em')
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text((d) => formatNumber(d.totalInteractions));

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('~s')); // ~s is a SI-prefix format

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .style('font-size', '12px')
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'center');

    // svg
    //   .append('g')
    //   .attr('transform', `translate(0, ${height - margin.bottom})`)
    //   .style('font-size', '12px')
    //   .call(d3.axisBottom(xScale))
    //   .selectAll('text')
    //   .style('text-anchor', 'center');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .style('font-size', '12px')
      .call(d3.axisLeft(yScale)).selectAll('.tick text')  // Select all tick text elements
      .text((_, index) => `#${index + 1} Tweet`);  // Update text content based on data

    svg
      .append('g')
      .attr('transform', 'translate(' + width/2 + ', ' + (height + 10) + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      // .attr('transform', 'rotate(-90)')
      .style('font-size', '14px')
      .text('Total Interactions');

    d3.select('#bar-chart').on('end', onChartRender);

    // Cleanup
    return () => {
      svg.selectAll('*').remove();
    };
  }, [data]);

  return <svg id='bar-chart' ref={ref} />;
};

export default BarChart;
