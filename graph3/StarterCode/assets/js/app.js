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
var parseTime = d3.timeParse("%Y-%b-%d");
parseTime("2010-01-01");

// Load data
d3.csv("assets/data/sales-by-stores.csv").then(function(salesData) {
     console.log(salesData);  
     console.log([salesData]);

    // Parse Data
    // salesData.forEach(function(data) {
    //     data.date= parseTime(data.date);
    //     data.store = +data.store;
    //     data.weekly_sales = +data.weekly_sales;    
    //   });

function makeChart(salesData) {
  let sumweekly_sales = d3.rollups(salesData, )
}

    // Create scale functions
    var xTimeScale = d3.scaleTime()
      .domain([d3.extent(salesData, d => d.store)])
      .range([0, width]);

    var yLinearScale1 = d3.scaleLinear()
      .domain([0, d3.max(salesData, d => d.weekly_sales)])
      .range([height, 0]);

    var yLinearScale2 = d3.scaleLinear()
      .domain([0, d3.max(salesData, d => d.weekly_sales)])
      .range([height, 0]);   

    // Axis functions
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y-%d-%b"));
    var leftAxis = d3.axisLeft(yLinearScale1);
    var rightAxis = d3.axisRight(yLinearScale2);

    // Append axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .attr("transform", `translate(0, 0)`)
      .call(leftAxis);
   
    chartGroup.append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(rightAxis);

    // Line generators for each line
    var line1 = d3.line()
        .x(d => xTimeScale(d.store))
        .y(d => yLinearScale1(d.weekly_sales));

    var line2 = d3.line()
        .x(d => xTimeScale(d.store))
        .y(d => yLinearScale2(d.weekly_sales));

    // Append a path for line1
    chartGroup.append("path")
        .attr("d", line1(salesData))
        .classed("line green", true);

    // Append a path for line2
    chartGroup.append("path")
        .attr("d", line2(salesData))
        .classed("line blue", true);

    // Append axes titles
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .classed("weekly_sales-text text", true)
        .text("Weekly Sales");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
        .classed("store-text text", true)
        .text("Stores");

}).catch(error=> console.log(error))

