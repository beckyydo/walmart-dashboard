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
var link = '/data/walmartLocations.geojson'

fetch(link).then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log(data);
    createFeatures(data.features);
});

function createFeatures(locationData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.name + "</h3><hr/><h5>" + feature.properties.address1 + "</h5>");
    }

    var myIcon = L.icon({
        iconUrl: '/data/cart_blue.png',
        iconSize: [30,20]
    })

    var stores = L.geoJSON(locationData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            var marker = L.marker(latlng, {icon: myIcon});
            marker.bindPopup(feature.properties.name + "<br/>" + feature.properties.address1);
            return marker;
        }
    });
    
    createMap(stores);

}

function createMap(stores) {

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    });

    var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });    

    var baseMaps = {
        "Dark Map": darkmap,
        "Street Map": streetmap,
        "Light Map": lightmap
        
    };

    var overlayMaps = {
        Stores: stores
    };

    var myMap = L.map("map", {
        center: [36.358498566, -94.209832494],
        zoom: 5,
        layers: [streetmap, stores]
    });

    var clusters = L.markerClusterGroup();
    clusters.addLayer(stores);
    
    myMap.addLayer(clusters);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

}



