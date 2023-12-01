import * as d3 from 'd3';
import {ScaleLinear, ScaleLogarithmic} from "d3-scale";
import React, { useEffect, useRef } from 'react';
import {IFetchTweetMapData} from "../../types";


interface ScatterPlotProps {
  data: IFetchTweetMapData[];
  scale: 'log' | 'linear'
  onBrush: (selectedPoints: IFetchTweetMapData[]) => void
  onChartRender: () => void
  width?: number
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, scale = 'log', onBrush, onChartRender }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 70 };
    const width = 1080 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    let xScale: ScaleLogarithmic<number, number> | ScaleLinear<number, number>;
    let yScale: ScaleLogarithmic<number, number> | ScaleLinear<number, number>;

    if (scale === 'log') {
      xScale = d3.scaleLog().domain([1, d3.max(data, (d) => d.time_before)!]).range([0, width]);
      yScale = d3.scaleLog().domain([1, d3.max(data, (d) => d.time_after)!]).range([height, 0]);
    } else {
      xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.time_before)!]).range([0, width]);
      yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.time_after)!]).range([height, 0]);
    }


    const brush = d3
      .brush()
      .extent([
        [0, 0],
        // [width, height],
        [1080, 650],
      ])
      .on('end', (event) => {
        if (!event?.selection) {
          // Reset colors when brushing ends without selection
          svg.selectAll('.point').classed('selected', false).classed('non-selected', false);
          return;
        }
        if (event && event.selection) {
          let [[x0, y0], [x1, y1]] = event.selection;

          x0 = x0 - margin.left;
          y0 = y0 - margin.top;
          x1 = x1 - margin.left;
          y1 = y1 - margin.top;


          // Remove previous classes
          svg.selectAll('.point').classed('selected', false).classed('non-selected', false);

          // Select points within the brush area
          const selectedPoints = data.filter(
            (d) => xScale(d.time_before) >= x0 && xScale(d.time_before) <= x1 && yScale(d.time_after) >= y0 && yScale(d.time_after) <= y1
          );

          // Add classes to selected and non-selected points - Optimised
          svg.selectAll('.point')
            .data(data)
            .join('circle')
            .attr('class', d => `point ${selectedPoints.includes(d) ? 'selected' : 'non-selected'}`);

          // Unoptimised
          // svg
          //   .selectAll('.point')
          //   .data(data)
          //   .classed('selected', (d) => selectedPoints.includes(d))
          //   .classed('non-selected', (d) => !selectedPoints.includes(d));

          // const [pX0Value, pX1Value] = [x0,x1].map(xScale.invert)
          // const [pY0Value, pY1Value] = [y0,y1].map(yScale.invert)

          // console.log(`(x0,y0) = (${pX0Value}, ${pY0Value})`)
          // console.log(`(x1,y1) = (${pX1Value}, ${pY1Value})`)


          onBrush(selectedPoints)
          // console.log({selectedPoints});



          // console.log(event.selection.map(xScale.invert));
          // const formattedDate = (currentDate: Date) => currentDate.toISOString().split('T')[0];
        }
      });

    svg.append("g")
      .call(brush);

    // svg
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom);

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

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

    let tickValues: number[] = [];
    if (scale === 'log') {
      // const tickValues = [1, 2, 10, 20, 100, 200, 1000, 2000, 10000, 20000, 80000];
      tickValues = [1, 2, 10, 20, 120, 240, 600, 1200, 7200, 14400, 79200];
    } else {
      tickValues = [0, 7200, 14400, 21600, 28800, 36000, 43200, 50400, 57600, 64800, 72000, 79200];
    }



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
      )
      .style('font-size', '14px');


    // Add Y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat((d) => formatTickLabel(d.valueOf())))
      .style('font-size', '14px');

    // const isEqualTimePattern = (selectedData: ITweetData, index: number) => data.every(
    //   (d, i, arr) => selectedData.time_before - d.time_before === arr[1].time_before - arr[0].time_before
    // );

    // Calculate Euclidean distance between points
    // const calculateDistance = (point1: ITweetData, point2: ITweetData) => {
    //   // console.log({ point1, point2 });
    //   return Math.sqrt(Math.pow(point1.time_before - point2.time_before, 2) + Math.pow(point1.time_after - point2.time_after, 2));
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
    //   .domain([d3.min(data, d => d.time_before), d3.max(data, d => d.time_before)])
    //   .interpolator(d3.interpolateCool);

    // const colors = ['#66c2a5', '#fc8d62', '#8da0cb'];

// Create a color scale
//     const colorScale = d3.scaleQuantize()
//       .domain([d3.min(data, d => d.time_after), d3.max(data, d => d.time_after)])
//       .range(colors);


    svg.append('g')
      .attr('transform', 'translate(' + (margin.right - 5) + ', ' + height/2 + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Time After Tweet');


    svg.append('g')
      .attr('transform', 'translate(' +  (width/2 + margin.left) + ', ' + (height + margin.bottom + 10) + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      // .attr('transform', 'rotate(180)')
      .text('Time Before Tweet');

    const getRadius = (totalData: IFetchTweetMapData[]): number => {
      if (totalData.length > 10000) return 1.5;
      if (totalData.length > 4000 && totalData.length < 8000) return 2.5;
      else return 3.5;
    }

    // Add scatterplot points
    svg
      .selectAll('.point')
      // .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d.time_before) + margin.left)
      .attr('cy', (d) => yScale(d.time_after) + margin.top)
      // .attr('cx', (d) => xScale(d.time_before) + margin.left + Math.random() * 5) // Adjust jittering here
      // .attr('cy', (d) => yScale(d.time_after) + margin.top + Math.random() * 5)

      .attr('r', getRadius(data)) // adjust the radius based on your preference
      // .style('fill', (datum, index) => isEqualTimePattern(datum, index) ? 'blue' : 'orange') // Adjust colors here
      // .style('fill', d => colorScale(d.time_before))
    // .style('fill', (d, i, arr) => colorScale(i === arr.length - 1 ? 0 : calculateDistance(d, arr[i + 1])))
      .style('fill', '#66c2a5') // adjust the color based on your preference
      .style('opacity', 0.7); // Adjust the transparency here

    d3.select('#scatter-plot')
      .on('end', onChartRender);



  }, [data, scale]);

  return (
    <svg ref={svgRef} id='scatter-plot'>
      {/* SVG content will be added dynamically */}
    </svg>
  );
};

export default ScatterPlot;
