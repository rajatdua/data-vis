// Place Holder file
import React, { useState, useEffect } from 'react';

const PlotlyChart: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(''); // State for the start date
  const [endDate, setEndDate] = useState<string>('');     // State for the end date

  useEffect(() => {
    // Fetch data when both start and end dates are available
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      // Format the date range and send it to the API
      const apiUrl = `/api/plotly-chart?start=${startDate}&end=${endDate}`;
      const response = await fetch(apiUrl);
      const htmlContent = await response.text();

      // Inject the HTML content into a container
      const container = document.getElementById('plotly-chart');
      if (container) {
        container.innerHTML = htmlContent;
      }
    } catch (error) {
      console.error('Error loading Plotly chart:', error);
    }
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  return (

  );
};

export default PlotlyChart;
