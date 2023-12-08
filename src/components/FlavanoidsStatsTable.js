import React, { useState, useEffect } from "react";
import dataset from "../Wine-Data.json";

//function to calculate Mean
const calculateMean = (data, property) => {
  const sum = data.reduce((acc, item) => acc + item[property], 0);
  return sum / data.length;
};

//function to calculate Median
const calculateMedian = (data, property) => {
  const sortedData = data.slice().sort((a, b) => a[property] - b[property]);
  const middleIndex = Math.floor(sortedData.length / 2);

  if (sortedData.length % 2 === 0) {
    return (
      (sortedData[middleIndex - 1][property] +
        sortedData[middleIndex][property]) /
      2
    );
  } else {
    return sortedData[middleIndex][property];
  }
};

//function to calculate Mode
const calculateMode = (data, property) => {
  const countMap = {};
  let maxCount = 0;
  let mode = null;

  data.forEach((item) => {
    const value = item[property];
    countMap[value] = (countMap[value] || 0) + 1;

    if (countMap[value] > maxCount) {
      maxCount = countMap[value];
      mode = value;
    }
  });

  return mode;
};

const FlavanoidsStatsTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Calculate stats for each class
    const uniqueClasses = [...new Set(dataset.map((item) => item.Alcohol))];
    const statsData = [];

    uniqueClasses.forEach((classValue) => {
      const mean = calculateMean(
        dataset.filter((item) => item.Alcohol === classValue),
        "Flavanoids"
      );
      const median = calculateMedian(
        dataset.filter((item) => item.Alcohol === classValue),
        "Flavanoids"
      );
      const mode = calculateMode(
        dataset.filter((item) => item.Alcohol === classValue),
        "Flavanoids"
      );

      statsData.push({
        class: classValue,
        mean,
        median,
        mode,
      });
    });
    setTableData(statsData);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Measure</th>
          {tableData.map((item) => (
            <th key={item.class}>Class {item.class}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Flavanoids Mean</td>
          {tableData.map((item) => (
            <td key={item.class}>{item.mean.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td>Flavanoids Median</td>
          {tableData.map((item) => (
            <td key={item.class}>{item.median.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td>Flavanoids Mode</td>
          {tableData.map((item) => (
            <td key={item.class}>{item.mode.toFixed(3)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default FlavanoidsStatsTable;
