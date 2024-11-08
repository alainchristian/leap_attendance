import { useState, useEffect } from 'react';

// Simulated real-time data generator
const generateRandomData = (baseValue, variance = 0.1) => {
  const change = baseValue * variance * (Math.random() - 0.5);
  return Math.round((baseValue + change) * 10) / 10;
};

const useRealTimeUpdates = (initialData, updateInterval = 5000, customUpdateFn = null) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      if (customUpdateFn) {
        setData(currentData => customUpdateFn(currentData));
      } else if (Array.isArray(initialData)) {
        // Update array data (for charts)
        setData(currentData => 
          currentData.map(item => ({
            ...item,
            value: typeof item.value === 'number' ? generateRandomData(item.value) : item.value,
            attendance: item.attendance ? generateRandomData(item.attendance) : undefined,
            average: item.average ? generateRandomData(item.average) : undefined
          }))
        );
      } else if (typeof initialData === 'object') {
        // Update object data (for stats)
        setData(currentData => ({
          ...currentData,
          value: typeof currentData.value === 'number' 
            ? generateRandomData(currentData.value)
            : currentData.value
        }));
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [initialData, updateInterval, customUpdateFn]);

  return {
    data,
    setData
  };
};

export default useRealTimeUpdates;