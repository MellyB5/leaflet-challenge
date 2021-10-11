// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 4
  });
  
// Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// API call
  var quake_data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// grab data
  d3.json(quake_data).then(function(data){
    console.log(data);
    L.geoJson(data, {
      pointToLayer: (feature, LatLng) => L.circleMarker(LatLng),
      style: (feature) => {
        console.log(feature.properties.mag);
        return {
          radius: feature.properties.mag * 3,
          fillColor: chooseColor(feature.properties.mag),
          color: chooseColor(feature.properties.mag),
          fillOpacity: 1
        }
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Mag: " + feature.properties.place + "<hr>Mag: " + feature.properties.mag);
      }
    }).addTo(myMap);
    var legend = L.control(
      {
        position: "bottomright"
      }
    );
    legend.onAdd = function(){
      var div = L.DomUtil.create("div", "legend");
      colors = [
        "#f06b6b",
        "#f0a76b",
        "#f3ba4d",
        "#f3db4d",
        "#e1f34d",
        "#b7f34d"
      ];
      labels = [
        ">=5",
        "4-5",
        "3-4",
        "2-3",
        "1-2",
        "0-1"
      ];
      for(var i=0; i<colors.length;i++){
        div.innerHTML += `<i style="background-color:${colors[i]};">${labels[i]}</i><br>`;
      }
      return div;
    };

    legend.addTo(myMap);

  });

  function chooseColor(mag){
    color = "#b7f34d";
    if (mag>=5) color = "#f06b6b";
    else if (mag>=4) color = "#f0a76b";
    else if (mag>=3) color = "#f3ba4d";
    else if (mag>=2) color = "#f3db4d";
    else if (mag>=1) color = "#e1f34d";
    return color

  }