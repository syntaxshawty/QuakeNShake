var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

function addDataLayer(map, data) {

  map.addSource("earthquakes", {
    type: "geojson",
    data: data,
  });

  map.addLayer({
    id: "earthquake-layer",
    type: "circle",
    source: "earthquakes",
    paint: {
      // make circles larger as the user zooms from z12 to z22
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 5 (or less) -> circle radius will be 8px
        5,
        8,
        // zoom is 10 (or greater) -> circle radius will be 5px
        10,
        5,
      ],
      //circle is redder the stronger the magnitude
      "circle-color": [
        "rgba",
        255,
        ["-", 255, ["*", 30, ["get", "mag"]]],
        0,
        0.8,
      ],
      "circle-stroke-color": "black",
      "circle-stroke-width": 1,
    },
  });
}

// When a click event occurs on a feature in the eathquakes layer, open a popup at the location of the feature, with description of its properties.
function displayPopUp(e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var location = e.features[0].properties.place;
  var time = new Date(e.features[0].properties.time);
  var mag = e.features[0].properties.mag.toFixed(2);
  var description =
    "<strong>Magnitude: </strong>" +
    mag +
    "\n" +
    `<strong>Location:</strong> ` +
    location +
    "\n" +
    "<strong>Coordinates: </strong>[" +
    coordinates +
    "]\n" +
    "<strong>Time: </strong>" +
    time +
    "\n";

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  return new mapboxgl.Popup().setLngLat(coordinates).setHTML(description);
}

export { addDataLayer, displayPopUp };
