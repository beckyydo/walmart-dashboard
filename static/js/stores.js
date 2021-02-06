
// //Map and tiles
// var mymap = L.map('mapid', {
//     center: [36.334474208699255, -94.12507100205349],
//     zoom: 4})
//     .addLayer(new L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//         maxZoom: 18,
//         id: 'mapbox/streets-v11',
//         tileSize: 512,
//         zoomOffset: -1,
//         accessToken: API_KEY}));

//     L.marker([36.334474208699255, -94.12507100205349]).addTo(mymap);

// d3.csv("data/storeMarkers.csv").then(
//     (data, error) => {
//         if(error) {
//             console.log(error)
//             }else{
//                 var storeData = data;
//                 console.log(storeData);
//                 }
//             }
//     );
        

// function createCharts(walmart) {
//     d3.json("data/walmart.json").then((data) => {
//         var storeData = data.walmart;
//         var locationArr = storeData.filter(storeDataobject => storeDataobject.state == storeData);
//         var location = locationArr[0]
        
//     }



// var mapimg;

// var clat = 36.334474208699255;
// var clon = -94.12507100205349;

// var ww = 1024;
// var hh = 512;
// var zoom = 3;
// var stores;

// function preload() {
//     mapimg = loadImage( 'https://api.mapbox.com/styles/v1/mapbox/light-v9/static/' +
//       clon +
//       ',' +
//       clat +
//       ',' +
//       zoom +
//       '/' +
//       ww +
//       'x' +
//       hh +
//       '?access_token=pk.eyJ1IjoibWFpbmVzczkyIiwiYSI6ImNra2p4ajB0cjA1bHgyb2xzYzA5NXNpeHEifQ.D-5Il_uqOin4D8ZWrqeVqw'
//   );

//     stores = loadTable('data/storeMarkers.csv', "header");
//     console.log(stores);
// };

// function mercX(lon) {
//   lon = radians(lon);
//   var a = (256 / PI) * pow(2, zoom);
//   var b = lon + PI;
//   return a * b;
// };

// function mercY(lat) {
//   lat = radians(lat);
//   var a = (256 / PI) * pow(2, zoom);
//   var b = tan(PI / 4 + lat / 2);
//   var c = PI - log(b);
//   return a * c;
// };


// function setup() {
//   createCanvas(ww, hh);
//   translate(width / 2, height / 2);
//   imageMode(CENTER);
//   image(mapimg, 0, 0);

//   var cx = mercX(clon);
//   var cy = mercY(clat);

//     var data = stores.getRows();
//     console.log(data);
//     var length = stores.getRowCount();

//     for (var i = 0; i < length; i++) {
//         var lat = data[2];
//         var lon = data[3];
    
//     var x = mercX(lon) - cx;
//     var y = mercY(lat) - cy;
//     // This addition fixes the case where the longitude is non-zero and
//     // points can go off the screen.
        
//     fill(255, 0, 255, 200);
//     ellipse(x, y, 5, 5);
//   };
// };


var url = "/api/store";

d3.json(url).then(function(data) {
    console.log(data);
});

function buildChart(data) {
    var storeData = {
        type:'scattergeo',
        locationmode: 'USA-states',
        latitude: data.map(data => data.Latitude)
    }

    var layout = {
        scope: "usa",
        title: "Walmart Store Locations",
        showlegend: false,
        geo: {
            scope:"usa",
            projection: {
                type:"albers usa"
            },
            showland: true,
            landcolor: "rgb(217, 217, 217)",
            subunitwidth: 1,
            countrywidth: 1,
            subunitcolor: "rgb(255, 255, 255)",
            countrycolor: "rgb(255,255,255)"
            }
        };
        Plotly.newPlot("mapid", storeData, layout);
}
    

