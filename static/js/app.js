// Monthly Service Route
var month_url = "/api/monthly"

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.selectAll("#monthly")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%m");

d3.json(month_url).then(data => {
    console.log(data)

    data.forEach(function(entry) {
        entry.month = parseTime(entry.month);
        entry.sales = +entry.sales;
        console.log(entry.month)
      });
    
})










// Market Share Service Route
var url = "/api/market_share"

// Initalize Graph and Tables
d3.json(url).then(data =>{
    // Retrieve State Name List
    var state_name = data.map(d => d.State);
    var share_cat = data.map(d => d.Share_Cat);

    // Add All Option in Menu
    state_name.push("*All")
    share_cat.push("*All")
    // Sort and Get Unique State Name for Dropdown Menu
    var unique_state = [...new Set(state_name.sort())]; 
    var unique_cat = [...new Set(share_cat.sort())]; 
    // Dropdown Menu
    var DropDownMenu = d3.select("#selDataset");
    var DropDownMenu2 = d3.select("#selDataset2");
    // Remove old html id names
    DropDownMenu.html("");    
    DropDownMenu2.html("");
    // Append id names option to html
    unique_state.map(id_name => DropDownMenu.append("option").attr("value",id_name).html(id_name));
    unique_cat.map(id_name => DropDownMenu2.append("option").attr("value",id_name).html(id_name));


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
// Update Plot
d3.selectAll("#selDataset2").on('change', updatePlotly);

// Update Plot Function
function updatePlotly(){
    
    d3.json(url).then(data => {
            // Get Value From Search Bar
            var dropdownMenu = d3.select("#selDataset").node().value;
            var dropdownMenu2 = d3.select("#selDataset2").node().value;
            // Clear graphs
            d3.select("#market-share").html("");
    
    
            if (dropdownMenu == "*All" && dropdownMenu2 == "*All"){
                init(data);
            }
            else {
                if (dropdownMenu2 == "*All"){
                    var filter_data = data.filter(row => row.State == dropdownMenu);
                } else if (dropdownMenu == "*All"){
                    if (dropdownMenu2 == '>90%'){
                        var filter_data = data.filter(row => row.Share > 90);
                    } else if (dropdownMenu2 =='80%<_<90%'){
                        var filter_data = data.filter(row => row.Share <=90 && row.Share > 80);
                    } else if (dropdownMenu2 =='70%<_<80%'){
                        var filter_data = data.filter(row => row.Share <=80 && row.Share > 70);
                    } else if (dropdownMenu2 =='60%<_<70%'){
                        var filter_data = data.filter(row => row.Share <=70 && row.Share > 60);
                    } else {
                        var filter_data = data.filter(row => row.Share <=60);
                    }
                }
                else{
                    if (dropdownMenu2 == '>90%'){
                        var filter_data = data.filter(row => row.Share > 90);
                    } else if (dropdownMenu2 =='80%<_<90%'){
                        var filter_data = data.filter(row => row.Share <=90 && row.Share > 80);
                    } else if (dropdownMenu2 =='70%<_<80%'){
                        var filter_data = data.filter(row => row.Share <=80 && row.Share > 70);
                    } else if (dropdownMenu2 =='60%<_<70%'){
                        var filter_data = data.filter(row => row.Share <=70 && row.Share > 60);
                    } else {
                        var filter_data = data.filter(row => row.Share <=60);
                    }
                    var filter_data = filter_data.filter(row => row.State == dropdownMenu)
                }                    
                var error = d3.select("#Error")
                if (filter_data =={}){
                    error.html("")
                    error.text("Combination Does Not Work Try Again or Reset")
                }
                else {
                    error.html("")
                }
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


    