//Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 120},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
// var parseDate = d3.timeParse("%b %Y");

// Set the ranges
var x = d3.scaleLinear().range([0, width]);  
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var salesline = d3.line()	
    .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.sales); });

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("/data").then(function(data) {
  
  console.log(data)

  data.forEach(function(d) {
		d.month = +d.month;
		d.sales = +d.sales;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.month; }));
    y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.year;})
        .entries(data);

    // Loop through each symbol / key
    dataNest.forEach(function(d) { 
      if (d.key == 2010) {
        var lineColor =  "CornflowerBlue"
      }
      else if (d.key == 2011) {
        var lineColor = "DarkCyan"
      }
      else {
        var lineColor =  "DarkSlateBlue"
      };
        
      svg.append("path")
      .attr("class", "line")
      .attr("d", salesline(d.values))
      .style("stroke", lineColor);

    });

    // Add the X Axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // Create axes labels
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .style("fill", "black")
      .style("font-weight", "bold")
      .text("Sales ($)");

      svg.append("text")
      .attr("transform", `translate(${width /2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .style("font", "20px sans-serif")
      .style("font-weight", "bold")
      .text("Month");

});