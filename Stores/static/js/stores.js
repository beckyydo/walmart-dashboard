//Map and tiles
var mymap = L.map('mapid', {
    center: [36.334474208699255, -94.12507100205349],
    zoom: 13
})

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

var marker = L.marker([36.334474208699255, -94.12507100205349]).addTo(mymap);

// Establish data source

// const url = "/api/store";

// var data = d3.json("data/walmart.json").then(function(data) {
//     console.log(data);
    
// });

// ;

// // for (var i = 0; i < locations.length; i++) {
// //     storeLocations.push(
// //         L.marker(locations[i].
// //         )
// // }


// const url = "/api/store";
// d3.json(url, function(response) {
//     console.log(response);

//     var storeLocations = response;

//     for (var i = 0; i < storeLocations.length; i++) {
//         var location = storeLocations[i];
//         L.marker(storeLocations)
//             .addTo(mymap);
//     }


// });

var data = d3.json("data/walmart.json").then(function(data) {
    console.log(data);

    var locationDict = {};
    locationDict[new_key] = new_value;
});


