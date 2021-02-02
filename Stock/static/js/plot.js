d3.csv("assets/data/WMT.csv").then(function(data){
    console.log(data);
    var dates= data.map(record=>record.Date);
    var closingPrices = data.map(record=>record.Close);
    var highPrices = data.map(record=>record.High);
    var lowPrices = data.map(record=>record.Low);
    var openingPrices = data.map(record=>record.Open);
    //console.log(openingPrices);
    
    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: "Walmart closing prices",
        x: dates,
        y: closingPrices,
        line: {
          color: "#2e7b71"
        }
      };
  
      // Candlestick Trace
      var trace2 = {
        type: "candlestick",
        name: "Walmart high, low, open, close stock prices", 
        x: dates,
        high: highPrices,
        low: lowPrices,
        open: openingPrices,
        close: closingPrices
      };
  
      var data = [trace1, trace2];
  
       var layout = {
         title: "Walmart Stock",
         xaxis: {
           //range: ["1990-01-01", "2020-08-01"],
           type: "date"
         },
         yaxis: {
           autorange: true,
           type: "linear"
         }
        }
  
      Plotly.newPlot("plot", data, layout);
})