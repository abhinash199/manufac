import React, { useState, useEffect } from "react";
import dataset from "../Wine-Data.json";

//function to calculate Gamma
const calculateGamma = (point) => {
  return (point.Ash * point.Hue) / point.Magnesium;
};

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

const GammaStatsTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Calculate Gamma for each point
    const datasetWithGamma = dataset.map((point) => ({
      ...point,
      Gamma: calculateGamma(point),
    }));

    // Calculate stats for each class
    const uniqueClasses = [
      ...new Set(datasetWithGamma.map((item) => item.Alcohol)),
    ];
    const statsData = [];

    uniqueClasses.forEach((classValue) => {
      const mean = calculateMean(
        datasetWithGamma.filter((item) => item.Alcohol === classValue),
        "Gamma"
      );
      const median = calculateMedian(
        datasetWithGamma.filter((item) => item.Alcohol === classValue),
        "Gamma"
      );
      const mode = calculateMode(
        datasetWithGamma.filter((item) => item.Alcohol === classValue),
        "Gamma"
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
          <td>Gamma Mean</td>
          {tableData.map((item) => (
            <td key={item.class}>{item.mean.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td>Gamma Median</td>
          {tableData.map((item) => (
            <td key={item.class}>{item.median.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td>Gamma Mode</td>
          {tableData.map((item) => (
            <td key={item.class}>{item.mode.toFixed(3)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default GammaStatsTable;
