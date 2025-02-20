var map = L.map("map").setView([45.32028874603523, -116.53680470840834], 10) // zoom to snake river

// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
  attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',}).addTo(map)
var kmlLayer = omnivore.kml('Idaho Rivers_LayerToKML.kml') // Replace with your file path
.on('ready', function() {
var layer = kmlLayer.getLayers();
        
layer.forEach(function(feature) {
  var props = feature.feature.properties;

}));

function closePopup() {
  document.getElementById('popup').classList.add('hidden');
}
