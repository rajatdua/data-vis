import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

interface ScatterPlotProps {
  data: { timeBefore: number; timeAfter: number }[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 1080 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Set up scales
    // const xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.timeBefore)!]).range([0, width]);
    // const yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.timeAfter)!]).range([height, 0]);

    const xScale = d3.scaleLog().domain([1, d3.max(data, (d) => d.timeBefore)!]).range([0, width]);
    const yScale = d3.scaleLog().domain([1, d3.max(data, (d) => d.timeAfter)!]).range([height, 0]);


    // Add X-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.top + 10})`)
      .call(d3.axisBottom(xScale));

    // Add Y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    // Add scatterplot points
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.timeBefore) + margin.left)
      .attr('cy', (d) => yScale(d.timeAfter) + margin.top)
      .attr('r', 5) // adjust the radius based on your preference
      .style('fill', 'blue'); // adjust the color based on your preference
  }, [data]);

  return (
    <svg ref={svgRef}>
      {/* SVG content will be added dynamically */}
    </svg>
  );
};

export default ScatterPlot;
