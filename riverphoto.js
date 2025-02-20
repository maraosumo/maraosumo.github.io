var map = L.map("map").setView([43.66218988063861, -116.6863364262967], 4) // zoom to snake river

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

            // Apply custom icon if it's a point
            if (feature instanceof L.Marker) {
                feature.setIcon(customIcon);
            }
            // Bind popup with name or description from KML
            feature.bindPopup(props.name || "No Name");
            
            // Bind tooltip (label) with name
            feature.bindTooltip(props.name || "Unnamed", { permanent: true, direction: "right" });
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
