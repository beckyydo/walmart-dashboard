var url = "/api/market_share"
d3.json(url).then(data =>{

        var state_name = data.map(d => d.State);
    
        state_name.push("*All")
        
        // Sort and Get Unique State Name for Dropdown Menu
        var unique_state = [...new Set(state_name.sort())]; 
    
        // DROPDOWN MENU
        var DropDownMenu = d3.select("#selDataset");
        // Remove old html id names
        DropDownMenu.html("");    
        // Append id names option to html
        unique_state.map(id_name => DropDownMenu.append("option").attr("value",id_name).html(id_name));
    
        init(data);
    })
    
    function init(data){
    
        var scl = [[0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],[0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],[0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']];
    
        var data1 = [{
            type:'scattergeo',
            locationmode: 'USA-states',
            lon: data.map(d => d.Lon),
            lat: data.map(d => d.Lat),
            hoverinfor:  data.map(d => d.City),
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
        tbody.html("");
        data.forEach((entry)=>{
            var row = tbody.append("tr");
            
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
    d3.selectAll("body").on('change', updatePlotly);
    
    
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
                    subunitwidth: 0.5
                }
                };
                Plotly.newPlot("market-share", data2, layout2);
            }
        })
    };
    
    