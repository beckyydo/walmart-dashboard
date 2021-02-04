d3.csv("walmartdata.csv").then(function(walData, err) {
  if (err) throw err;

  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 120,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
  var chosenXAxis = "Fuel_Price";

// function used for updating x-scale var upon click on axis label
  function xScale(walData, chosenXAxis) {
  // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(walData, d => d[chosenXAxis]),
        d3.max(walData, d => d[chosenXAxis])
      ])
      .range([0, width]);

    return xLinearScale;

  }

// function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

// function used for updating circles group with a transition to
// new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
  }

// function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "Fuel_Price") {
      label = "Fuel Price:";
    }
    else if (chosenXAxis === "CPI") {
      label = "CPI:";
    }
    else if (chosenXAxis === "Temperature_C") {
      label = "Temperature C:"
    }
    else {
      label = "Unemployment:"
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`Week Date: ${d.Week_Date}<br>${label} ${d[chosenXAxis]}<br>Weekly Sale: $${(d.Weekly_Sales).toFixed(2)}<br>${d.Holiday_Name}`);
      });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
    // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below


  // parse data

  d3.select("#selDataset").selectAll("option")
    .data(d3.map(walData, function(d){return d.Store;}).keys())
    .enter()
    .append("option")
    .text(function(d){return d;})
    .attr("value",function(d){return d;});


  function getChart(storeID) {
    walData = walData.filter(d => d.Store === storeID) 
  }  
  walData.forEach(function(sample) {
    sample.Fuel_Price = +sample.Fuel_Price;
    sample.Temperature_C = +sample.Temperature_C;
    sample.Unemployment = +sample.Unemployment;
    sample.Weekly_Sales = +sample.Weekly_Sales;
    sample.CPI = +sample.CPI
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(walData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(walData, d => d.Weekly_Sales)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles

  var circlesGroup = chartGroup.selectAll("circle")
    .data(walData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.Weekly_Sales))
    .attr("r", 3)
    .attr("stroke", "black")
    .attr("fill", function(d) {
      if (d.Holiday_Name !== "No Holiday")
        return "blue";
      else {
        return "red";
      }
    });


  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var FuelLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "Fuel_Price") // value to grab for event listener
    .classed("active", true)
    .text("Fuel Price");

  var CPILabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "CPI") // value to grab for event listener
    .classed("inactive", true)
    .text("CPI");
  var UnemLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "Unemployment") // value to grab for event listener
    .classed("inactive", true)
    .text("Unemployment"); 
  var TempLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "Temperature_C") // value to grab for event listener
    .classed("inactive", true)
    .text("Temperature C"); 
  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Weekly Sales");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(walData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "CPI") {
          CPILabel
            .classed("active", true)
            .classed("inactive", false);
          FuelLabel
            .classed("active", false)
            .classed("inactive", true);
          UnemLabel
            .classed("active", false)
            .classed("inactive", true);
          TempLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "Temperature_C") {
          CPILabel
            .classed("active", false)
            .classed("inactive", true);
          FuelLabel
            .classed("active", false)
            .classed("inactive", true);
          UnemLabel
            .classed("active", false)
            .classed("inactive", true);
          TempLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenXAxis === "Unemployment") {
          CPILabel
            .classed("active", false)
            .classed("inactive", true);
          FuelLabel
            .classed("active", false)
            .classed("inactive", true);
          UnemLabel
            .classed("active", true)
            .classed("inactive", false);
          TempLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          CPILabel
            .classed("active", false)
            .classed("inactive", true);
          FuelLabel
            .classed("active", true)
            .classed("inactive", false);
          UnemLabel
            .classed("active", false)
            .classed("inactive", true);
          TempLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
