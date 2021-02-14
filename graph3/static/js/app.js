//Set the dimensions of the canvas / graph
var margin = {top: 30, right: 80, bottom: 120, left: 130},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
// var parseDate = d3.timeParse("%b %Y");

// Set the ranges
var x = d3.scaleLinear().range([0, width]);  
var y = d3.scaleLinear().range([height, 0]);

// Set the legend keys
var legend_keys = new Array("2010","2011","2012")
var legend_colours = new Array("CornflowerBlue","DarkCyan","DarkSlateBlue")

// cornflowerBlue:#6495ed
// DarkCyan: #008b8b
// DarkSlateBlue: #483d8b

// var colours = d3.scale.ordinal().range(['#6495ed', '#008b8b', '#483d8b'])

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

    legendSpace = width/dataNest.length;

    // Loop through each symbol / key
    dataNest.forEach(function(d, i) { 
       
          svg.append("path")
              .attr("class", "line")
              .attr("d", salesline(d.values))
              .style("stroke", legend_colours[i]);

          // svg.append("text")
          //     .attr("x", (legendSpace / 2) + i * legendSpace)  // space legend
          //     .attr("y", height + (margin.bottom / 2) + 5)
          //     .style("fill", function() {return legend_colours[i]; })
          //     .attr("class", "legend")
          //     .text(d.key);

          svg.append("circle").attr("cx",200+ 60*i).attr("cy",10).attr("r", 6).style("fill", legend_colours[i])
          svg.append("text").attr("x", 210 + 60*i).attr("y", 16).text(d.key).style("font-size", "15px").attr("alignment-baseline","middle")
          

          // var legend = svg.select(".legend")
          //     .data(d.key)
          //     .enter().append("g")
          //     .attr("class", "legend")
          //     .attr("transform", "translate(0," + i * 25 + ")");
        
          // legend.append("rect")
          //     .attr("x", width - 18)
          //     .attr("width", 18)
          //     .attr("height", 18)
          //     .style("fill", legend_colours[i] );
          
          // legend.append("text")
          //     .attr("x", width - 24)
          //     .attr("y", 9)
          //     .attr("dy", ".35em")
          //     .style("text-anchor", "end")
          //     .text(d.key);
      
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
      .style("font", "17px sans-serif")
      .style("font-weight", "bold")
      .text("Sales ($)");

      svg.append("text")
      .attr("transform", `translate(${width /2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .style("font", "17px sans-serif")
      .style("font-weight", "bold")
      .text("Month");
    
});