//Establish data source
const url = '/api/store';

d3.json(url).then(function(data) {
    console.log(data); 
    // createMarkers(data);  
    createMap(data);

});

function createMap(data) {

    var myIcon = L.icon({
        iconUrl: 'https://s3.amazonaws.com/shecodesio-production/uploads/files/000/004/934/original/shopping_cart.png?1613066289',
        iconSize: [30,25]
    })

    var marker = [];
    data.forEach(function(dataPoint) {
        marker.push(
            L.marker([dataPoint.Latitude, dataPoint.Longitude], {
                icon:myIcon
                })
        )   
    })

    var markerLayer = L.layerGroup(marker);

    var clusters = L.markerClusterGroup();
    clusters.addLayer(markerLayer);

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
        "Light Map": lightmap,
    };

    var overlayMaps = {
        Stores: markerLayer
    };

    var myMap = L.map("map", {
        center: [36.358498566, -94.209832494],
        zoom: 5,
        layers: [treasure]
    });

    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: true
    // }).addTo(myMap);
    
    myMap.addLayer(clusters);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

}
