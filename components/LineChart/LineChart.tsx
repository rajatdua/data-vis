import * as d3 from "d3";
import {Mouse} from "playwright-core";
import React, {useEffect, useRef} from 'react';
import {DateValueType} from "react-tailwindcss-datepicker";
import {IDataPoint} from "../../types";

interface IPartyData { date: Date | null, value: number }

const createLineGraph = (ref: React.MutableRefObject<SVGSVGElement | null>, data: IDataPoint[], updateDateRange: (date: DateValueType) => void, resetDateRange?: () => void) => {
  const parseDate = d3.timeParse("%a, %d %b %Y %H:%M:%S %Z");

  const democratData: IPartyData[] = [];
  const republicanData: IPartyData[] = [];
  data.forEach((dataPoint) => {
    const { candidate, date } = dataPoint;
    const democrat = candidate[0];
    const republican = candidate[1];
    const currDate = parseDate(date);
    democratData.push({ date: currDate, value: parseFloat(democrat.value) })
    republicanData.push({ date: currDate, value: parseFloat(republican.value) })
  });
  const margin = { top: 20, right: 20, bottom: 65, left: 70 },
    width = 1280 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
  if (ref !== null) {
    const svg = d3.select(ref.current)
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('end', (event) => {
        if (!event?.selection && resetDateRange) {
          resetDateRange();
          return;
        }
        if (event && event.selection) {
          const [start, end]: [Date, Date] = event.selection.map(x.invert);
          const formattedDate = (currentDate: Date) => currentDate.toISOString().split('T')[0];
          // Do something with selected date range
          updateDateRange({ startDate: formattedDate(start), endDate: formattedDate(end) })
        }
      });

    svg.append("g")
      .call(brush);

    // add X axis and Y axis
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(democratData, (d: IPartyData) => { return d.date;  }) as [Date, Date]);
    y.domain([d3.min(democratData, (d: IPartyData) => { return d.value; }) as number - 15, d3.max(democratData, (d: IPartyData) => { return d.value; }) as number + 5]);


    const xAxisGrid = d3
      .axisBottom<Date>(x)
      .tickSize(-height)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat('%B %Y'));

    const yAxisGrid = d3.axisLeft(y).tickSize(-width).ticks(10);

    svg.append('g')
      .attr('class', 'x axis-grid')
      .attr("transform", `translate(0, ${height})`)
      .call(xAxisGrid)
      .selectAll('line')
      .style('stroke-dasharray', '2, 2') // Dotted line style
      .style('stroke', '#eee'); // Color of the grid lines


    svg.selectAll('text') // Select all text elements
      .attr('transform', 'rotate(-45)') // Rotate the text labels by -45 degrees
      .style('text-anchor', 'end')
      .attr('dx', '-0.5em');



    // svg.append("g")
    //   .call(d3.axisLeft(y));

    svg.append('g')
      .call(yAxisGrid)
      .selectAll('line')
      .style('stroke-dasharray', '2, 2') // Dotted line style
      .style('stroke', '#eee'); // Color of the grid lines


    svg.append('g')
      .attr('transform', 'translate(' + -50 + ', ' + height/2 + ')')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Percentage Distribution');

    // Add legends
    const legends = svg.append('g')
      .attr('class', 'legends')
      .attr('transform', `translate(${width - 120}, 30)`);

    const legendItems = legends.selectAll('.legend')
      .data([{ name: 'Democrat', color: 'blue' }, { name: 'Republican', color: 'red' }])
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d) => d.color);

    legendItems.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .style('font-size', '12')
      .text((d) => d.name);





    // add the Line
    const valueLine = d3.line<IPartyData>()
      .x((d) => { return x(d.date ?? new Date()); })
      .y((d) => { return y(d.value); });


    svg.append("path")
      .data([democratData])
      .attr("class", "data-line")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("x-class", "democrat")
      .attr("position", "relative")
      .attr("stroke-width", 1.5)
      .attr("d", valueLine);


    svg.append("path")
      .data([republicanData])
      .attr("class", "data-line")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("x-class", "republican")
      .attr("position", "relative")
      .attr("stroke-width", 1.5)
      .attr("d", valueLine);



    // Tooltip setup
    // const tooltip =  svg.append('div')
    //   .attr('class', 'tooltip')
    //   // .style('opacity', 0)
    //   .style("visibility", "hidden")
    //   .style('position', 'absolute')
    //   .style('background', 'black')
    //   .style('pointer-events', 'none')
    //
    //
    const tooltip = d3.select('#tooltip');

    const handleMouseOver = (event: MouseEvent) => {
      if (event.target !== null) {
        const selectedClass = (event.target as Element).getAttribute('x-class');
        const mousePos = d3.pointer(event);
        const selectedData = selectedClass === 'democrat' ? democratData : republicanData;
        const bisectDate = d3.bisector((d: IPartyData) => d.date).left;
        const x0 = x.invert(mousePos[0]);
        const i = bisectDate(selectedData, x0, 1);
        const d0 = selectedData[i - 1];
        const d1 = selectedData[i];
        const hoveredData = (x0.getTime() - (d0.date === null ? 0 : d0.date.getTime())) > ((d1.date === null ? 0 : d1.date.getTime()) - x0.getTime()) ? d1 : d0;

        const strokeColor = (event.target as Element).getAttribute('stroke');

        const bgColor = `linear-gradient(180deg, ${strokeColor}, white)`;

        tooltip
          // .transition()
          // .duration(200)
          .style('opacity', 0.9)
          .style("visibility", "visible")
          .style('background', bgColor)
          .style('border', 'solid 1.5px black')
          .style('padding', '8px')
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px');
        tooltip.html(`Date: ${d3.timeFormat('%B %d, %Y')(hoveredData.date ?? new Date())}<br/>Value: ${hoveredData?.value}%`);
      }
    };

    const handleMouseOut = () => {
      tooltip
        // .transition()
        // .duration(500)
        .style("visibility", "hidden")
        .style('opacity', 0);
    };

    // svg.selectAll('.data-line')
    //   .on('mouseover', handleMouseOver)
    //   .on('mouseout', handleMouseOut);

    const line = svg.selectAll('.data-line');

// Create an invisible overlay for each line that will capture the mouse events
    const overlay = line.clone()
      .style('stroke', 'transparent')
      .style('stroke-width', '20px') // Adjust the stroke width to your needs
      .classed('data-line-overlay', true);

    overlay
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);


  }

};

interface LineProps {
  data: IDataPoint[]
  updateDateRange: (date: DateValueType) => void
  resetDateRange?: () => void
}

const LineChart: React.FC<LineProps> = ({ data, updateDateRange, resetDateRange }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    createLineGraph(ref, data, updateDateRange, resetDateRange);
  }, []);
  return <><svg ref={ref}/><div id="tooltip" style={{ position: 'absolute', opacity: 0, color: 'white', textShadow: 'black 0px 0px 2px' }} /></>;
};

export default LineChart;