import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';


interface ITweetData { timeBefore: number; timeAfter: number }
interface ScatterPlotProps {
  data: ITweetData[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 70 };
    const width = 1080 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    // Set up scales
    // const xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.timeBefore)!]).range([0, width]);
    // const yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.timeAfter)!]).range([height, 0]);

    const xScale = d3.scaleLog().domain([1, d3.max(data, (d) => d.timeBefore)!]).range([0, width]);
    const yScale = d3.scaleLog().domain([1, d3.max(data, (d) => d.timeAfter)!]).range([height, 0]);


    const removeDecimalIfZero = (value: string) => {
      const number = value.split('.');
      if (number[1] === '0') return number[0];
      else return value;
    };
    const formatTickLabel = (value: number) => {
      if (value >= 86400) {
        // Convert to days if value is greater than or equal to 1 day (86400 seconds)
        return removeDecimalIfZero(d3.format('.1f')(value / 86400)) + 'd';
      } else if (value >= 3600) {
        // Convert to hours if value is greater than or equal to 1 hour (3600 seconds)
        return removeDecimalIfZero(d3.format('.1f')(value / 3600)) + 'h';
      } else if (value >= 60) {
        // Convert to minutes if value is greater than or equal to 1 minute (60 seconds)
        return removeDecimalIfZero(d3.format('.1f')(value / 60)) + 'm';
      } else {
        // Display seconds for smaller values
        return removeDecimalIfZero(d3.format('.1f')(value)) + 's';
      }
    };

    const tickValues = [1, 2, 10, 20, 100, 200, 1000, 2000, 10000, 20000, 80000];


    // Add X-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.top + 40})`)
      // .call(d3.axisBottom(xScale));
      // .call(d3.axisBottom(xScale).ticks(10, '.1s').tickFormat((d) => d3.format('.1s')(d)));
      .call(
        d3
          .axisBottom(xScale)
          // .ticks(6, '.1s')
          .tickValues(tickValues)
          .tickFormat((d) => formatTickLabel(d.valueOf()))
      );


    // Add Y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat((d) => formatTickLabel(d.valueOf())));

    // const isEqualTimePattern = (selectedData: ITweetData, index: number) => data.every(
    //   (d, i, arr) => selectedData.timeBefore - d.timeBefore === arr[1].timeBefore - arr[0].timeBefore
    // );

    // Calculate Euclidean distance between points
    // const calculateDistance = (point1: ITweetData, point2: ITweetData) => {
    //   // console.log({ point1, point2 });
    //   return Math.sqrt(Math.pow(point1.timeBefore - point2.timeBefore, 2) + Math.pow(point1.timeAfter - point2.timeAfter, 2));
    // }

    // Calculate average distance within each cluster
    // const calculateAverageDistance = (cluster: ITweetData[]) => {
    //   const distances = [];
    //   for (let i = 0; i < cluster.length - 1; i++) {
    //     distances.push(calculateDistance(cluster[i], cluster[i + 1]));
    //   }
    //   return d3.mean(distances);
    // };

    // Create a color scale based on distance
    // const colorScale = d3.scaleSequential(d3.interpolateTurbo)
    //   .domain([0, d3.max(data, (d, i, arr) => (i === Array.from(arr).length - 1 ? 0 : calculateDistance(d, Array.from(arr)[i + 1])))!]);

    // const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0, d3.max(data, (_1, _2, array) => calculateAverageDistance(Array.from(array)))!]);

    // const colorScale = d3.scaleSequential()
    //   .domain([d3.min(data, d => d.timeBefore), d3.max(data, d => d.timeBefore)])
    //   .interpolator(d3.interpolateCool);

    // const colors = ['#66c2a5', '#fc8d62', '#8da0cb'];

// Create a color scale
//     const colorScale = d3.scaleQuantize()
//       .domain([d3.min(data, d => d.timeAfter), d3.max(data, d => d.timeAfter)])
//       .range(colors);


    svg.append('g')
      .attr('transform', 'translate(' + margin.right + ', ' + height/2 + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Time After Tweet');


    svg.append('g')
      .attr('transform', 'translate(' +  (width/2 + margin.left) + ', ' + (height + margin.bottom) + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      // .attr('transform', 'rotate(180)')
      .text('Time Before Tweet');

    console.log({ length: data.length });

    const getRadius = (totalData: ITweetData[]): number => {
      if (totalData.length > 15000) return 1.5;
      if (totalData.length > 4000 && totalData.length < 8000) return 2.5;
      else return 3.5;
    }

    // Add scatterplot points
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.timeBefore) + margin.left)
      .attr('cy', (d) => yScale(d.timeAfter) + margin.top)
      // .attr('cx', (d) => xScale(d.timeBefore) + margin.left + Math.random() * 5) // Adjust jittering here
      // .attr('cy', (d) => yScale(d.timeAfter) + margin.top + Math.random() * 5)

      .attr('r', getRadius(data)) // adjust the radius based on your preference
      // .style('fill', (datum, index) => isEqualTimePattern(datum, index) ? 'blue' : 'orange') // Adjust colors here
      // .style('fill', d => colorScale(d.timeBefore))
    // .style('fill', (d, i, arr) => colorScale(i === arr.length - 1 ? 0 : calculateDistance(d, arr[i + 1])))
      .style('fill', '#66c2a5') // adjust the color based on your preference
      .style('opacity', 0.7); // Adjust the transparency here



  }, [data]);

  return (
    <svg ref={svgRef}>
      {/* SVG content will be added dynamically */}
    </svg>
  );
};

export default ScatterPlot;
