d3.json("/api/stock").then(function(data){
  //console.log(data);
  

  var dates= data.map(record=>record.dates);
  var closingPrices = data.map(record=>record.closingPrices);
  var highPrices = data.map(record=>record.highPrices);
  var lowPrices = data.map(record=>record.lowPrices);
  var openingPrices = data.map(record=>record.openingPrices);
  var volume= data.map(record=> parseInt(record.volume))
  var movingAvg= data.map(record=>record.movingAvg);
  var colors = data.map(record=>record.colors)
  
  trace1 = {
      name: 'Walmart high, low, open, close stock prices', 
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
    Plotly.plot('plot', {
      data: data,
      layout: layout
  });

})