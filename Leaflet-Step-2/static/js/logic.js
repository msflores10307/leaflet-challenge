var mapboxUrl = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`;
var satUrl = `https://api.mapbox.com/styles/v1/mapbox.satellite/tiles/{z}/{x}/{y}?access_token=${API_KEY}`;
var mapboxAttribution = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>";

var satellite = L.tileLayer(mapboxUrl,{
  attribution: mapboxAttribution,
  tileSize: 512,
  maxZoom: 6,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var streets = L.tileLayer(mapboxUrl, {
  attribution: mapboxAttribution,
  tileSize: 512,
  maxZoom: 6,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Creating map object
var myMap = L.map("map", {
    center: [40.7, -100],
    zoom: 4.3,
    layers: [satellite, streets]
  });



  var baseMaps = {
    "Streets": streets,
    "Satellite": satellite
    
};

  // Adding tile layer to the map
  streets.addTo(myMap)
  

  // Getting earthquake Data
  url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
  var geodata = d3.json(url, function(response){//function open


     


// ADDING TECTONIC PLATE BOUNDARIES
tectonicaddress = './data/boundaries.json'
var tectoniclayer ; 
tectonicdata  = d3.json(tectonicaddress,function(geodata){// tectonic function open

  // earthquake circles start

  // Create a new marker cluster group
  var markers = L.layerGroup();

  var magsum = 0;
  var magcount = 0;
  for (var i = 0; i < response.features.length; i++) { // loop 1 open

      var mag_i = +response.features[i].properties.mag;
      magsum = magsum + mag_i;
      magcount ++
  } // loop 1 close

  var magavg = magsum/magcount;
  console.log(magavg);



  for (var i = 0; i < response.features.length; i++) { // loop 2 open 

     var coord =  response.features[i].geometry.coordinates;
     var magnitude = response.features[i].properties.mag
     var latlong = [coord[1],coord[0]]
     var colorscale = ''
     var colorscalenorm = '' 
     if (magnitude >= 5) {colorscale = '#800000'};
     if (magnitude >= 4 && magnitude < 5) {colorscale = '#f6803f'};
     if (magnitude >= 3 && magnitude < 4 ) {colorscale = '#f5b34c'};
     if (magnitude >= 2 && magnitude < 3) {colorscale = '#f6e072'};
     if (magnitude >= 1 && magnitude < 2) {colorscale = '#c5e08b'};
     if (magnitude < 1) {colorscale = '#bde5c0'};

    

  var scaler = Math.pow(magnitude,2)/Math.pow(magavg,2)

     if (scaler > 4 ) {colorscalenorm = '#f6803f'};
     if (scaler >= 3 && scaler < 4 ) {colorscalenorm = '#f5b34c'};
     if (scaler >= 2 && scaler < 3) {colorscalenorm = '#f6e072'};
     if (scaler >= 1 && scaler < 2) {colorscalenorm = '#c5e08b'};
     if (scaler < 1) {colorscalenorm = '#bde5c0'};


     var props = {
      color: colorscale,
      // fillColor: colorscalenorm,
      fillOpacity: 0.8,
      radius: 20000*scaler //*scaler
    };

     markers.addLayer(L.circle(latlong, props).bindPopup(`${response.features[i].properties.type} : ${response.features[i].properties.title}`));
  //    markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])

  } // loop 2 close

  myMap.addLayer(markers);

  // earthquake circles end

var globalFaults = L.layerGroup();
for (var j = 0; j < geodata.features.length; j++) { // loop 3 open 

  var rawpath = geodata.features[j].geometry.coordinates;

  function coordflip(coord) { return [coord[1],coord[0]];}

  var tectonicpath = rawpath.map(coordflip);

  var tectonicpolyline = L.polyline(tectonicpath, {color: '	#FF8C00', opacity:.35});
  globalFaults.addLayer(tectonicpolyline);
}// loop 3 close

globalFaults.addTo(myMap)
var overlayMaps = {
  "Earthquakes": markers,
  "Fault Lines": globalFaults
};
var dummyBaseLayers = {};

L.control.layers(dummyBaseLayers,overlayMaps).addTo(myMap);

})//tectonic function close
  })//function closer



  // Adding Legend
  
  L.DomUtil.create('div', 'info legend');
  function getColor(d) {
    return d < 1 ? '#bde5c0' :
           d < 2  ? '#c5e08b' :
           d < 3  ? '#f6e072' :
           d < 4  ? '#f5b34c' :
           d < 5   ? '#f6803f' :
           d < 6   ? '#800000' : '#800000' ;
           
}

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) { 
    var div = L.DomUtil.create("div", "info legend");
    
        grades = [0,1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length-1; i++) {
        var legendlabel = `${grades[i]} - ${grades[i+1]}`;
        div.innerHTML +=
        `<div class = 'legend'>
        <i style=background:${getColor(grades[i])} > ${legendlabel}</i>
        </divs> ` +'<br>';
        // console.log(getColor(grades[i]))     
    }

    div.innerHTML +=
        `<div class = 'legend'>
        <i style=background:${getColor(grades[6])} > >= 5  </i>
        </div> `;

    return div;
};

legend.addTo(myMap);



L.control.layers(baseMaps).addTo(myMap);


