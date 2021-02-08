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

    // var myIcon = L.icon({
    //     iconUrl: ''
    // })

    var stores = L.geoJSON(locationData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            var marker = L.marker(latlng);
            marker.bindPopup(feature.properties.name + "<br/>" + feature.properties.address1);
            return marker;
        }
    });
    


    createMap(stores);

}

function createMap(stores) {

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

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap,
        "Light Map": lightmap,
        "Dark Map": darkmap
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
        collapsed: false
    }).addTo(myMap);

}



