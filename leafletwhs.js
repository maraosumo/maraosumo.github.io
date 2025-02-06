var map = L.map("map").setView([40.7608, -111.8910], 1) // View Centered on SLC
var wmsLayer = L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
		layers: 'OSM-WMS'
	}).addTo(map);

// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

const wmsLayer1 = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d96feb82dd71498e8be30dc2b4fb8d02/wms', {
      layers: 'HS-d96feb82dd71498e8be30dc2b4fb8d02:Counties',
	transparent: 'true',
	format: 'image/png',
      attribution: 'Hydroshare GeoServer'
	}).addTo(map);

const wmsLayer2 = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d96feb82dd71498e8be30dc2b4fb8d02/wms', {
      layers: 'HS-d96feb82dd71498e8be30dc2b4fb8d02:UTA_Routes_and_Most_Recent_Ridership',
	transparent: 'true',
	format: 'image/png',
      attribution: 'Hydroshare GeoServer'
	}).addTo(map);

const wmsLayer3 = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d96feb82dd71498e8be30dc2b4fb8d02/wms', {
      layers: 'HS-d96feb82dd71498e8be30dc2b4fb8d02:UTA_Stops_and_Most_Recent_Ridership',
	transparent: 'true',
	format: 'image/png',
      attribution: 'Hydroshare GeoServer'
	}).addTo(map);

var wmsLayer1Added = L.layerGroup([wmsLayer1]);
var wmsLayer2Added = L.layerGroup([wmsLayer2]);
var wmsLayer3Added = L.layerGroup([wmsLayer3]);


// Layer Control (enables toggling of KML layers)
var overlays = {
    "Utah Counties": wmsLayer1Added,
    "UTA Routes": wmsLayer2Added,
    "UTA Stops": wmsLayer3Added
};

L.control.layers(null, overlays).addTo(map);
