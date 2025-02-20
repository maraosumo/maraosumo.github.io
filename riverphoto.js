var map = L.map("map").setView([45.32028874603523, -116.53680470840834], 10) // zoom to snake river

// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
  attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',}).addTo(map)

var kmlLayer = omnivore.kml('Idaho Rivers_LayerToKML.kml') // Replace with your file path
.on('ready', function() {
var layer = kmlLayer.getLayers();
var kmlLayer = omnivore.kml('River_LayerToKML.kml') // Replace with your file path
.on('ready', function() {
var layer = kmlLayer.getLayers();
   
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
        
layer.forEach(function(feature) {
  var props = feature.feature.properties;

}));

function closePopup() {
  document.getElementById('popup').classList.add('hidden');
}
