// ******************************** WEEKLY SALES ********************************
var url1 = "/api/walmart"

d3.json(url1).then(wmartData => {
  //if (err) throw err;
  var dropRef = []

  var storesID = d3.map(wmartData, function(d){return d.Store;}).keys()

  storesID.sort(function(a, b){
    return a - b})

  dropRef.push("All Stores")

  storesID.forEach(function(d) {
    dropRef.push(d)
  })
  console.log(dropRef)

  dropRef.map(store => d3.select("#selDataset1").append("option").attr("value", store).html(store));

  getChart(wmartData);
})

d3.selectAll("#selDataset1").on('change', updateChart);

function updateChart() {

  d3.json(url1).then(data => {
    var dropDown = d3.select("#selDataset1").node().value;
    console.log(dropDown)
    d3.select(".chart").html("");
    var updateData;
    if (dropDown === "All Stores") {
      getChart(data)
      console.log(data)
    }
    else {
      console.log(data)
      updateData = data.filter(row => row.Store == dropDown)
      console.log(updateData)
      getChart(updateData)
    }   
    d3.select(".counter").text(dropDown)
  })
}


function getChart(walData) {
  walData.forEach(function(sample) {
    sample.Fuel_Price = +sample.Fuel_Price;
    sample.Temperature_C = +sample.Temperature_C;
    sample.Unemployment = +sample.Unemployment;
    sample.Weekly_Sales = +Math.round(sample.Weekly_Sales);
    sample.CPI = +sample.CPI;
    sample.Store = +sample.Store
  }); 
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

    // Create an SVG wrapper
    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // initial Params
    var chosenXAxis = "Fuel_Price";

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
            .offset([100, -80])
            .html(function(d) {
            return (`Week Date: ${d.Week_Date}<br>${label} ${d[chosenXAxis]}<br>Weekly Sale: $${(d.Weekly_Sales)}<br>${d.Holiday_Name}<br> Store: ${d.Store}`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
            .on("mouseout", function(data, index) {
            toolTip.hide(data);
            });

        return circlesGroup;
    }
    function xScale(walData, chosenXAxis) {
        var xLinearScale = d3.scaleLinear()
          .domain([d3.min(walData, d => d[chosenXAxis]),
            d3.max(walData, d => d[chosenXAxis])
          ])
          .range([0, width]);
    
        return xLinearScale;
    
      }

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
      .attr("value", d => d.Store)
      .attr("id", d => "Store" + d.Store)
      .attr("r", function(d) {
        var dropDown = d3.select("#selDataset1").node().value;
        if (d.Store == dropDown) {
          return 10
        }
        else {
          return 5
        }
      })
      .attr("stroke", "black")
      .attr("fill", function(d) {
        if (d.Holiday_Name !== "No Holiday")
          return "#0279E2";
        else {
          return "#FEBB0C";
        }
      }) 
      .on('click', function(d) {
        var value = d3.select(this).attr("value");
        console.log(value)
        storeCircles = d3.selectAll(`#Store${value}`)
        circlesGroup
          .transition()
          .duration(1000)
          .attr("opacity", 0.1)
          .attr("r", 3)
        storeCircles
          .transition()
          .duration(1000)
          .attr("opacity", 1.0)
          .attr("r", 10)
        d3.select(".counter").text(value)
      })
    
    d3.selectAll("button").on("click", function() {
          circlesGroup
            .transition()
            .duration(1000)
            .attr("opacity", 1.0)
            .attr("r", 5)
          d3.select(".counter").text("All Stores")
        })
    
    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var FuelLabel = labelsGroup.append("text")
      .attr("x", -200)
      .attr("y", 30)
      .attr("value", "Fuel_Price") // value to grab for event listener
      .classed("active", true)
      .text("Fuel Price");
    var TempLabel = labelsGroup.append("text")
      .attr("x", -100)
      .attr("y", 30)
      .attr("value", "Temperature_C") // value to grab for event listener
      .classed("inactive", true)
      .text("Temperature C"); 
    var UnemLabel = labelsGroup.append("text")
      .attr("x", 15)
      .attr("y", 30)
      .attr("value", "Unemployment") // value to grab for event listener
      .classed("inactive", true)
      .text("Unemployment");
    var CPILabel = labelsGroup.append("text")
      .attr("x", 95)
      .attr("y", 30)
      .attr("value", "CPI") // value to grab for event listener
      .classed("inactive", true)
      .text("CPI");
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
} 

// *********************************** STOCK ***********************************
d3.json("/api/stock").then(function(data){
  
    var dates= data.map(record=>record.dates);
    var closingPrices = data.map(record=>record.closingPrices);
    var highPrices = data.map(record=>record.highPrices);
    var lowPrices = data.map(record=>record.lowPrices);
    var openingPrices = data.map(record=>record.openingPrices);
    var volume= data.map(record=> parseInt(record.volume))
    var movingAvg= data.map(record=>record.movingAvg);
    var colors = data.map(record=>record.colors)
    
    trace1 = {
        name: 'Walmart High, Low, Open, <br> & Close Stock Prices', 
        type: 'candlestick', 
        x: dates, 
        yaxis: 'y2', 
        low: lowPrices, 
        high:highPrices, 
        open: openingPrices, 
        close: closingPrices
      };
      trace2 = {
        line: {width: 1}, 
        mode: 'lines', 
        name: 'Moving Average', 
        type: 'scatter', 
        x: dates, 
        y: movingAvg, 
        yaxis: 'y2', 
        marker: {color: '#0000FF'}
      };
      trace3 = {
        name: 'Volume', 
        type: 'bar', 
        x: dates, 
        y: volume, 
        yaxis: 'y', 
        marker: {
          color: colors
        }
      };
    var selectorOptions = {
        buttons: [{
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1m'
        }, {
            step: 'month',
            stepmode: 'backward',
            count: 6,
            label: '6m'
        }, {
            step: 'year',
            stepmode: 'todate',
            count: 1,
            label: 'YTD'
        }, {
            step: 'year',
            stepmode: 'backward',
            count: 1,
            label: '1y'
        }, {
            step: 'all',
        }],
    };
      data = [trace1, trace2, trace3];
      layout = {
        title: "Walmart Daily Stock Prices",
        xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {},
        },
        yaxis: {
          domain: [0, 0.2], 
          showticklabels: false
        },  
        yaxis2: {domain: [0.2, 1]}
     
      };
      Plotly.plot('plot', {
        data: data,
        layout: layout
    });
  
  })

// ******************************** MARKET SHARE ********************************
// Market Share Service Route
var url = "/api/market_share"

// Initalize Graph and Tables
d3.json(url).then(data =>{
    // Retrieve State Name List
    var state_name = data.map(d => d.State);
    // Add All Option in Menu
    state_name.push("*All")
    // Sort and Get Unique State Name for Dropdown Menu
    var unique_state = [...new Set(state_name.sort())]; 
    // Dropdown Menu
    var DropDownMenu = d3.select("#selDataset");
    // Remove old html id names
    DropDownMenu.html("");    
    // Append id names option to html
    unique_state.map(id_name => DropDownMenu.append("option").attr("value",id_name).html(id_name));
    // Initalize Data 
    init(data);
})
    
function init(data){
    
    // Set Colorscale
    var scl = [[0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],[0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],[0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']];
    
        var data1 = [{
            type:'scattergeo',
            locationmode: 'USA-states',
            lon: data.map(d => d.Lon),
            lat: data.map(d => d.Lat),
            hoverinfor:  `City Name: ${data.map(d => d.City)} <br> Population: ${data.map(d=>d.Population)}`,
            text:  data.map(d => d.City),
            mode: 'markers',
            marker: {
                size: 8,
                opacity: 0.8,
                reversescale: true,
                autocolorscale: false,
                symbol: 'circle',
                line: {
                    width: 1,
                    color: 'rgb(102,102,102)'
                },
                colorscale: scl,
                cmin: d3.min(data,d=>d.Share),
                cmax: d3.max(data,d=>d.Share),
                color: data.map(d => d.Share),
                colorbar: {
                    title: 'Market Share (%) <br>(All)'
                }
            }
        }];
    
    
        var layout1 = {
            title: 'Walmart Marketshare Over US (%)',
            colorbar: true,
            geo: {
                scope: 'usa',
                projection: {
                    type: 'albers usa'
                },
                showland: true,
                landcolor: 'rgb(250,250,250)',
                subunitcolor: 'rgb(217,217,217)',
                countrycolor: 'rgb(217,217,217)',
                countrywidth: 0.5,
                subunitwidth: 0.5
            }
        };
    
    Plotly.newPlot("market-share", data1, layout1);
    
    // Create table
    var tbody = d3.select("tbody");
    // Remove old tbody
    tbody.html("");
    //
    tbody.attr()
    
    // Add data to tbody
    data.forEach((entry)=>{
        // Apend row
        var row = tbody.append("tr");
        // Append value to row
        var cell = row.append("td");
        cell.text(entry.City)
        var cell2 = row.append("td");
        cell2.text(entry.State)
        var cell3 = row.append("td");
        cell3.text(entry.Population)
        var cell4 = row.append("td");
        cell4.text(entry.Share)        
    })
};
    
// Update Plot
d3.selectAll("#selDataset").on('change', updatePlotly);
    
// Update Plot Function
function updatePlotly(){
    
    d3.json(url).then(data => {
            // Get Value From Search Bar
            var dropdownMenu = d3.select("#selDataset").node().value;
            // Clear graphs
            d3.select("#market-share").html("");
    
    
            if (dropdownMenu == "*All"){
                init(data);
            }
            else {
                var filter_data = data.filter(row => row.State == dropdownMenu);
                var scl = [[0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],[0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],[0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']];
    
                var data2 = [{
                type:'scattergeo',
                locationmode: 'USA-states',
                lon: filter_data.map(d => d.Lon),
                lat: filter_data.map(d => d.Lat),
                hoverinfor:  filter_data.map(d => d.City),
                text:  filter_data.map(d => d.City),
                mode: 'markers',
                marker: {
                    size: 8,
                    opacity: 0.8,
                    reversescale: true,
                    autocolorscale: false,
                    symbol: 'circle',
                    line: {
                        width: 1,
                        color: 'rgb(102,102,102)'
                    },
                    colorscale: scl,
                    cmin: d3.min(data,d=>d.Share),
                    cmax: d3.max(data,d=>d.Share),
                    color: filter_data.map(d => d.Share),
                    colorbar: {
                        title: `Market Share (%)<br>(${dropdownMenu})`
                    }
                    }
                }];
        
        
                var layout2 = {
                    title: `Walmart Marketshare Over US (%) <br>(${dropdownMenu})`,
                    colorbar: true,
                    geo: {
                    scope: 'usa',
                    projection: {
                        type: 'albers usa'
                    },
                    showland: true,
                    landcolor: 'rgb(250,250,250)',
                    subunitcolor: 'rgb(217,217,217)',
                    countrycolor: 'rgb(217,217,217)',
                    countrywidth: 0.5,
                    subunitwidth: 0.5}
                };

                Plotly.newPlot("market-share", data2, layout2);
                // Create table
                var tbody = d3.select("tbody");
                // Clear tbody
                tbody.html("");

                filter_data.forEach((entry)=>{
                    //Add row
                    var row = tbody.append("tr");
                    //Add value to row
                    var cell = row.append("td");
                    cell.text(entry.City)
                    console.log(entry.City)
                    var cell2 = row.append("td");
                    cell2.text(entry.State)
                    var cell3 = row.append("td");
                    cell3.text(entry.Population)
                    var cell4 = row.append("td");
                    cell4.text(entry.Share)        
                });                
            }
    })
};
    
// ******************************** STORE LOCATION ********************************

// var link = '/api/store'

// d3.json(link).then( data => {
//     console.log(data);
// });

// fetch(link).then(function(response) {
//     return response.json();
// })
// .then(function(data) {
//     console.log(data);
//     createFeatures(data.features);
// });

// function createFeatures(locationData) {
//     function onEachFeature(feature, layer) {
//         layer.bindPopup("<h3>" + feature.properties.name + "</h3><hr/><h5>" + feature.properties.address1 + "</h5>");
//     }

//     var myIcon = L.icon({
//         iconUrl: '/data/cart_blue.png',
//         iconSize: [30,20]
//     })

//     var stores = L.geoJSON(locationData, {
//         onEachFeature: onEachFeature,
//         pointToLayer: function(feature, latlng) {
//             var marker = L.marker(latlng, {icon: myIcon});
//             marker.bindPopup(feature.properties.name + "<br/>" + feature.properties.address1);
//             return marker;
//         }
//     });
    
//     createMap(stores);

// }

// function createMap(stores) {

//     var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
//     });

//     var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//         maxZoom: 18,
//         id: 'mapbox/streets-v11',
//         tileSize: 512,
//         zoomOffset: -1,
//         accessToken: API_KEY
//     });

//     var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//         maxZoom: 18,
//         id: 'mapbox/light-v10',
//         tileSize: 512,
//         zoomOffset: -1,
//         accessToken: API_KEY
//     });    

//     var baseMaps = {
//         "Dark Map": darkmap,
//         "Street Map": streetmap,
//         "Light Map": lightmap
        
//     };

//     var overlayMaps = {
//         Stores: stores
//     };

//     var myMap = L.map("map", {
//         center: [36.358498566, -94.209832494],
//         zoom: 5,
//         layers: [streetmap, stores]
//     });

//     var clusters = L.markerClusterGroup();
//     clusters.addLayer(stores);
    
//     myMap.addLayer(clusters);

//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: true
//     }).addTo(myMap);

// }



