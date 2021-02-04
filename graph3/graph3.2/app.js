// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = { top: 20, right: 40, bottom: 60, left: 50 };

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group to the SVG area and shift
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create a function to parse date
//var parseTime = d3.timeParse("%Y-%m-%d");

// Import data from a CSV file
d3.csv("sales-by-store-summed3.csv").then(function(salesData) {  
  console.log(salesData);
  
  // Format Data
  salesData.forEach(function(data) {
      data.YearMonth = (data.YearMonth);
      data.store = +data.store;
      data.weekly_sales = +data.weekly_sales;  
  });
    
    // Create scale functions
    var xTimeScale = d3.scaleTime()
      .domain(d3.extent(salesData, d => d.YearMonth))
      .range([0, width]);

    var yLinearScale1 = d3.scaleLinear()
      .domain([0, d3.max(salesData, d => d.store)])
      .range([height, 0]);

    var yLinearScale2 = d3.scaleLinear()
      .domain([0, d3.max(salesData, d => d.weekly_sales)])
      .range([height, 0]);   

    // Axis functions
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat);
    var leftAxis = d3.axisLeft(yLinearScale1);
    var rightAxis = d3.axisRight(yLinearScale2);

//     // Add x-axis
//     chartGroup.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(bottomAxis);

//     // Add y1-axis to the left side of the display
//     chartGroup.append("g")
//       // Define the color of the axis text
//       .classed("black", true)
//       .call(leftAxis);

//     // Add y2-axis to the right side of the display
//     chartGroup.append("g")
//       // Define the color of the axis text
//       .classed("blue", true)
//       .attr("transform", `translate(${width}, 0)`)
//       .call(rightAxis);

//     // Line generators for each line
//     var line1 = d3.line()
//         .x(d => xTimeScale(d.date))
//         .y(d => yLinearScale1(d.weekly_sales));

//     var line2 = d3.line()
//         .x(d => xTimeScale(d.date))
//         .y(d => yLinearScale2(d.weekly_sales));

//     // Append a path for line1
//     chartGroup.append("path")
//         .data([salesData])
//         .attr("d", line1)
//         .classed("line black", true);

//     // Append a path for line2
//     chartGroup.append("path")
//         .data([salesData])
//         .attr("d", line1)
//         .classed("line blue", true);

//     // Append axes titles
//     chartGroup.append("text")
//      .attr("transform", "rotate(-90)", `translate(${width / 2}, ${height + margin.top + 20})`)
//         .classed("weekly-text text", true)
//         .text("Weekly Sales");

//     chartGroup.append("text")
//      .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
//         .classed("store-text text", true)
//         .text("Store");
// }).catch(function(error) {
    console.log(error);
});