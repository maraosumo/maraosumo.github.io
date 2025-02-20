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
// Loop through each feature in the KML
  kmlLayer2.eachLayer(function(layer) {
    var reachID = layer.feature.properties.Reach_ID;  // Assuming 'reach_id' is a property in KML
    var popupContent = `<b>Reach ID:</b> ${reachID} <br>
    <a href="#" onclick="fetchForecast(event, '${reachID}', this)">Get Forecast</a>
    <div id="forecast-${reachID}"></div>`;
    layer.bindPopup(popupContent);  // Bind popup with dynamic content
  });

    
  
layer2.forEach(function(feature) {
  var props = feature.feature.properties;  
  var customIcon = L.icon({
                iconUrl: 'river-clipart-xl.png' , // Replace with your own icon URL
                iconSize: [32, 32], // Width, Height in pixels
                iconAnchor: [16, 32], // Anchor point
                popupAnchor: [0, -32] // Adjusts popup position
            });

            // Bind tooltip (label) with name
              feature.bindTooltip(props.name || "Unnamed", { permanent: true, direction: "right" });
            // Event listener when a KML marker is clicked
                  if (feature instanceof L.Marker) {
                    feature.setIcon(customIcon);
                   }
                              
  });
});

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


function fetchForecast(event, reachID, linkElement) {
        event.preventDefault();  // Prevents page reload on link click
        var api_url = `https://api.water.noaa.gov/nwps/v1/reaches/${reachID}/streamflow?series=short_range`;
    
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
    };
