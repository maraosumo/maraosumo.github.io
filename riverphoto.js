var map = L.map("map").setView([43.69231057041175, -116.494094509993], 10) // zoom to snake river

// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

var kmlLayer = omnivore.kml('Idaho Rivers_LayerToKML.kml') // Replace with your file path
.on('ready', function() {
var layer = kmlLayer.getLayers();
});
  
var kmlLayer2 = omnivore.kml('River_LayerToKML.kml') // Replace with your file path
.on('ready', function() {
var layer2 = kmlLayer2.getLayers();
  
layer2.forEach(function(feature) {
  var props = feature.feature.properties;  
  var customIcon = L.icon({
                iconUrl: 'river-clipart-xl.png' , // Replace with your own icon URL
                iconSize: [32, 32], // Width, Height in pixels
                iconAnchor: [16, 32], // Anchor point
                popupAnchor: [0, -32] // Adjusts popup position
            });

            // Event listener when a KML marker is clicked
                kmlLayer.on('ready', function() {
            // Loop through each feature in the KML
                kmlLayer.eachLayer(function(layer2) {
                  var reachID = layer2.feature.properties.Reach_ID;  // Assuming 'reach_id' is a property in KML
                  var popupContent = `<b>Reach ID:</b> ${reachID} <br>
                  <a href="#" onclick="fetchForecast(event, '${reachID}', this)">Get Forecast</a>
                  <div id="forecast-${reachID}"></div>`;
                  layer.bindPopup(popupContent);  // Bind popup with dynamic content 
                  // Apply custom icon if it's a point
                  if (feature instanceof L.Marker) {
                    feature.setIcon(customIcon);
       }
                  // Bind tooltip (label) with name
                  feature.bindTooltip(props.name || "Unnamed", { permanent: true, direction: "right" });

                  function fetchForecast(event, reachID, linkElement) {
                  event.preventDefault();  // Prevents page reload on link click
                  var api_url = `https://apps.int.nws.noaa.gov/nwm/api/forecast?reach_id=${reachID}&product=short_range&variable=streamflow`;

                  fetch(api_url)
                    .then(response => response.json())
                    .then(data => {
                      var forecast = data.forecast ? data.forecast[0].streamflow_cfs + " CFS" : "No data available";
                      document.getElementById(`forecast-${reachID}`).innerHTML = `<b>Streamflow:</b> ${forecast}`;
                    })
                    .catch(error => {
                      console.error("Error fetching forecast:", error);
                      document.getElementById(`forecast-${reachID}`).innerHTML = `<b>Error:</b> Could not retrieve data.`;
                });
        };            });
                });});});

var kmlLayer1Added = L.layerGroup([kmlLayer]);
var kmlLayer2Added = L.layerGroup([kmlLayer2]);


// Layer Control (enables toggling of KML layers)
var overlays = {
    "Rivers and Streams in Idaho": kmlLayer1Added,
    "Popular Rivers and Streams": kmlLayer2Added
};

L.control.layers(null, overlays).addTo(map);

function closePopup() {
  document.getElementById('popup').classList.add('hidden');
  document.getElementById('map').style.visibility = 'visible';
};
