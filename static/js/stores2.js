
var myMap = L.map("map", {
        center: [36.358498566, -94.209832494],
        zoom: 5
        // layers: [darkmap]
    });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

//Establish api url
const url = '/api/store';

d3.json(url).then(function(data) {
    //console.log(data);   
    
    var stores = data;
    // console.log(stores);
    console.log(stores[1].City);

    var latlng = L.latLng(stores[1].Latitude, stores[1].Longitude);
    console.log(latlng);

    const myIcon = L.icon({
        iconUrl: 'https://www.pinclipart.com/picdir/big/548-5484973_shopping-cart-icon-clipart-clipart-royalty-free-library.png',
        iconSize: [30,25]
    });
   
    var marker = L.marker(latlng, {icon: myIcon})
        .bindPopup(stores[1].Address + "<hr />" + stores[1].City)
        .addTo(myMap);

    // const address = data.map(record => record.Address);
    // const city = data.map(record => record.City);
    // const latitude = data.map(record => record.Latitude);
    // const longitude = data.map(record => record.Longitude);

    // console.log(address, city,latitude, longitude);

    
    
    //for loop to convert lat and long into coordinates
    // var latlng = L.latLng();

    // console.log(latlng);

    // var markers = L.marker(latlng, {
    //     icon: myIcon,
    //     title: city});


    // var stores = L.layerGroup(markers);
});
//     // Streetmap Layer
//     var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//     });

//     var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "light-v10",
//         accessToken: API_KEY
//     });

//     var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
//     });

//     var baseMaps = {
//         "Street": streetmap,
//         "Light": lightmap,
//         "Dark": darkmap
//     };

//     var overlayMaps = {
//         "Stores": stores
//     };

//     var myMap = L.map("map", {
//         center: [],
//         zoom: 5,
//         layers:[darkmap, stores]
//     });

//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: true
//     }).addTo(myMap);
// });  

    // var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //     maxZoom: 18,
    //     id: "dark-v10",
    //     accessToken: API_KEY
    // });

    // var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox/streets-v11',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     accessToken: API_KEY
    // });

    // var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox/light-v10',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     accessToken: API_KEY
    // });    

    // var baseMaps = {
    //     "Dark Map": darkmap,
    //     "Street Map": streetmap,
    //     "Light Map": lightmap
        
    // };

    // var overlayMaps = {
    //     Stores: stores
    // };

    // var myMap = L.map("map", {
    //     center: [36.358498566, -94.209832494],
    //     zoom: 5,
    //     layers: [darkmap]
    // });

    // var clusters = L.markerClusterGroup();
    // clusters.addLayer(stores);
    
    // myMap.addLayer(clusters);

    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: true
    // }).addTo(myMap);

