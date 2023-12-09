import React from "react";
import ChartSwitcher from "./ChartSwitcher";
import {IDashboard} from "../../store/app";
import {ICommonChartProps} from "../../types";

interface IFloatingChartProps extends ICommonChartProps, IDashboard {}

const FloatingChartsContainer: React.FC<IFloatingChartProps> = ({ date, dashboards, dashboardIds = [] }) => {
  return (
    <div>
      {dashboardIds.map(dashboardId => {
        const selectedDashboard = dashboards[dashboardId]
        return (
          <div key={dashboardId}>
            {selectedDashboard.title}
            {Object.keys(selectedDashboard.graphsToRender ?? {}).map(graphKey => {
              return (
                <ChartSwitcher key={`${dashboardId}-${graphKey}`} chartType={graphKey} date={date} chartData={selectedDashboard.tweetIds} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};


export default FloatingChartsContainer;