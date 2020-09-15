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

    for (var i = 0; i < response.features.length; i++) { // loop open 

       var coord =  response.features[i].geometry.coordinates;
       var latlong = [coord[1],coord[0]]
       console.log(latlong)


       var props = {
        color: 'green',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50000000};

       markers.addLayer(L.marker(latlong));
    //    markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])

    } // loop close

    myMap.addLayer(markers);

  })//function closer