console.log("AHH!")

// Creating map object
var myMap = L.map("map", {
    center: [40.7, -100],
    zoom: 4.3
  });

  // Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


  // Getting Data
  url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
  var geodata = d3.json(url, function(response){//function open

    console.log(response) // checking we get data

     // Create a new marker cluster group
    var markers = L.markerClusterGroup();

    var magsum = 0;
    var magcount = 0;
    for (var i = 0; i < response.features.length; i++) { // loop 1 open

        var mag_i = response.features[i].properties.mag;
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

       if (magnitude > 4 ) {colorscale = 'red'};
       if (magnitude >= 3 && magnitude < 4 ) {colorscale = 'orange'};
       if (magnitude >= 2 && magnitude < 3) {colorscale = 'yellow'};
       if (magnitude >= 1 && magnitude < 2) {colorscale = 'green'};
       if (magnitude < 1) {colorscale = 'white'};

    var scaler = magnitude/magavg;

       if (scaler > 4 ) {colorscalenorm = 'red'};
       if (scaler >= 3 && scaler < 4 ) {colorscalenorm = 'orange'};
       if (scaler >= 2 && scaler < 3) {colorscalenorm = 'yellow'};
       if (scaler >= 1 && scaler < 2) {colorscalenorm = 'green'};
       if (scaler < 1) {colorscalenorm = 'white'};


       var props = {
        color: colorscale,
        // fillColor: colorscalenorm,
        fillOpacity: 0.8,
        radius: 50000*scaler};

       markers.addLayer(L.circle(latlong, props).bindPopup(`${response.features[i].properties.title}`));
    //    markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])

    } // loop 2 close

    myMap.addLayer(markers);

  })//function closer



  // Attempting LEGEND
  
  L.DomUtil.create('div', 'info legend');
  function getColor(d) {
    return d < 1 ? 'white' :
           d < 2  ? 'green' :
           d < 3  ? 'yellow' :
           d < 4  ? 'orange' :
           d < 5   ? 'red' :
           d < 6   ? 'red' : 'red' ;
           
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
            `<i style=background:${getColor(grades[i])} >${legendlabel}</i> ` +
             '<br>';
        // console.log(getColor(grades[i]))     
    }

    return div;
};

legend.addTo(myMap);