
//init function for load and reset
function init(){
  d3.json("/api/stock").then(function(data){
  
    // Assign the data from `data.js` to a descriptive variable
    let tableData = data;
    
    //defining variables to plot the stock
    var dates= data.map(record=>record.dates);
    var closingPrices = data.map(record=>record.closingPrices);
    var highPrices = data.map(record=>record.highPrices);
    var lowPrices = data.map(record=>record.lowPrices);
    var openingPrices = data.map(record=>record.openingPrices);
    var volume= data.map(record=> parseInt(record.volume))
    var movingAvg= data.map(record=>record.movingAvg);
    var colors = data.map(record=>record.colors)

    //create traces and data and layout to plot the stock candlestick
    var trace1 = {
      name: 'Walmart high, low, open, close stock prices', 
      type: 'candlestick', 
      x: dates, 
      yaxis: 'y2', 
      low: lowPrices, 
      high:highPrices, 
      open: openingPrices, 
      close: closingPrices
    };

    var trace2 = {
      line: {width: 1}, 
      mode: 'lines', 
      name: 'Moving Average', 
      type: 'scatter', 
      x: dates, 
      y: movingAvg, 
      yaxis: 'y2', 
      marker: {color: '#0000FF'}
    };

    var trace3 = {
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


    var data = [trace1, trace2, trace3];
  
    var layout = {
      title: "Walmart Stock",
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
    
    //plot the initial plot with all data
    Plotly.newPlot('plot', data,layout);

  });
}


// Create reset button
var reset = d3.select("#reset-btn")

//with click the reset button run init function to load all data
reset.on("click", init)

// Select the form and button
var data_button = d3.select("#filter-btn");

// Create event handlers
data_button.on("click", runEnter);

// Complete the event handler function for the button
function runEnter() {
    d3.event.preventDefault();
    

    //select the plot area
    var plotArea = d3.select("#plot")

    //clear the plot area
    plotArea.html("")

    //get the input value of dates for search
    var inputValue1 = d3.select("#datetime1").property("value");
    var inputValue2 = d3.select("#datetime2").property("value");
    console.log(inputValue1);
    console.log(inputValue2);

    //clear the search field
    d3.select("#datetime1").property('value', "");
    d3.select("#datetime2").property('value', "");

   d3.json("/api/stock").then(function(tableData) {

    //filter the data based on the input dates
    var filteredData = tableData.filter(record => record.dates >= inputValue1);
    var finalfilteredData= filteredData.filter(item=>item.dates<=inputValue2)
    // console.log(finalfilteredData)

    //defining variables to plot the filtered stock
    var dates1= finalfilteredData.map(row=>row.dates);
    var closingPrices1 = finalfilteredData.map(row=>row.closingPrices);
    var highPrices1 = finalfilteredData.map(row=>row.highPrices);
    var lowPrices1 = finalfilteredData.map(row=>row.lowPrices);
    var openingPrices1 = finalfilteredData.map(row=>row.openingPrices);
    var volume1= finalfilteredData.map(row=> parseInt(row.volume))
    var movingAvg1= finalfilteredData.map(row=>row.movingAvg);
    var colors1 = finalfilteredData.map(row=>row.colors)
    
    //create traces and data and layout to plot the filtered stock candlestick
    var trace4 = {
        name: `Walmart stock data from ${inputValue1} to ${inputValue2}`, 
        type: 'candlestick', 
        x: dates1, 
        yaxis: 'y2', 
        low: lowPrices1, 
        high:highPrices1, 
        open: openingPrices1, 
        close: closingPrices1
      };
    var trace5 = {
        line: {width: 1}, 
        mode: 'lines', 
        name: 'Moving Average', 
        type: 'scatter', 
        x: dates1, 
        y: movingAvg1, 
        yaxis: 'y2', 
        marker: {color: '#0000FF'}
      };

    var trace6 = {
        name: 'Volume', 
        type: 'bar', 
        x: dates1, 
        y: volume1, 
        yaxis: 'y', 
        marker: {
          color: colors1
        }
      };
    
    var data1 = [trace4, trace5, trace6];

    var layout1 = {
        title: "Walmart Stock",
        xaxis: {
            rangeslider: {},
        },
        yaxis: {
          domain: [0, 1], 
          showticklabels: false
        },  
        yaxis2: {domain: [0.2, 1]}
     
      };
      //plot the candlestick with the filtered data
      Plotly.newPlot('plot', data1, layout1);
  });
};

