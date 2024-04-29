"use client"
import { useState, useEffect } from "react";
import * as d3 from "d3";

export default function Home() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [parameter, setParameter] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (buttonClicked) {
      generateChart(data);
    }
  }, [data, buttonClicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonClicked(true);

    if (!state || !district || !startYear || !endYear || !parameter) {
      setError('All fields are required');
      return;
    }

    try {
      // Mock data for demonstration
      const responseData = [
        { year: 1965, rainfall: 4555.32 },
        { year: 1966, rainfall: 7489.07 },
        { year: 1967, rainfall: 5527.14 },
        // Add more data entries here
      ];

      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
  };

  const generateChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = window.innerWidth > 500 ? 500 : window.innerWidth - 40;
    const height = 300;

    // Remove any existing chart
    d3.select("#chart").selectAll("*").remove();

    // Append SVG to the container
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.rainfall)])
      .nice()
      .range([height, 0]);

    // Draw bars
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.year))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.rainfall))
      .attr("height", d => height - y(d.rainfall))
      .attr("fill", "steelblue");

    // Draw x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("dy", ".35em")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    // Draw y-axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add labels
    svg.append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 20})`)
      .style("text-anchor", "middle")
      .text("Year");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Rainfall (mm)");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md text-gray-800 w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
        <h1 className="text-3xl mb-6 text-center">Annual Rainfall Visualization</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={state} onChange={(e) => setState(e.target.value)} className="input-field">
              <option value="">Select State</option>
              <option value="Bihar">Bihar</option>
            </select>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="input-field">
              <option value="">Select District</option>
              <option value="Purnia">Purnia</option>
            </select>
            <input type="number" placeholder="Start Year" value={startYear} onChange={(e) => setStartYear(e.target.value)} className="input-field" />
            <input type="number" placeholder="End Year" value={endYear} onChange={(e) => setEndYear(e.target.value)} className="input-field" />
            <select value={parameter} onChange={(e) => setParameter(e.target.value)} className="input-field">
              <option value="">Select Parameter</option>
              <option value="Precipitation">Precipitation</option>
              <option value="Minimum temperature">Minimum temperature</option>
              {/* Add more options for other parameters */}
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="mt-8 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full">Generate Chart</button>
        </form>
        {buttonClicked && <div id="chart" className="mt-8"></div>}
      </div>
    </div>
  );
}
