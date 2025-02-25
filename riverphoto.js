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

var kmlLayer3 = omnivore.kml('Idaho.kml') // Replace with your file path
.on('ready', function() {
var layer = kmlLayer3.getLayers();
});

var kmlLayer2 = omnivore.kml('River_LayerToKML.kml') // Replace with your file path
.on('ready', function() {

var layer2 = kmlLayer2.getLayers();
// Loop through each feature in the KML
  kmlLayer2.eachLayer(function(layer) {
    var reachID = layer.feature.properties.reach_id;  // Assuming 'reach_id' is a property in KML
    var popupContent = `<b>Reach ID:</b> ${reachID} <br>
    <a href="#" onclick="fetchForecast(event, '${reachID}')">Get Forecast</a>
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
var kmlLayer3Added = L.layerGroup([kmlLayer3]);

function closePopup() {
  document.getElementById('popup').classList.add('hidden');
  document.getElementById('map').style.visibility = 'visible';
};


async function fetchForecast(event, reachId) {
        event.preventDefault();  // Prevents page reload on link click
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.style.display = 'block';
      
        try {
          const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=short_range`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status} - ${response.statusText}`);
          }
      
          const json_data = await response.json();
      
          if (!json_data.shortRange || !json_data.shortRange.series || !json_data.shortRange.series.data || json_data.shortRange.series.data.length === 0) {
              throw new Error("No forecast data available for this Reach ID.");
          }
      
          const shortStreamflowData = json_data.shortRange.series.data;
          const timestamps = shortStreamflowData.map(item => item.validTime);
          const flowValues = shortStreamflowData.map(item => item.flow);
          
          //Medium Range
            const mediumApiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=medium_range`;
            const mediumResponse = await fetch(mediumApiUrl);
            if (!mediumResponse.ok) {
              throw new Error(`HTTP error status: ${mediumResponse.status} - ${mediumResponse.statusText}`);
            }
        
            const medium_json_data = await mediumResponse.json();
        
            if (!medium_json_data.mediumRange || !medium_json_data.mediumRange.mean || !medium_json_data.mediumRange.mean.data || medium_json_data.mediumRange.mean.data.length === 0) {
                throw new Error("No forecast data available for this Reach ID.");
            }
            const mediumStreamflowData = medium_json_data.mediumRange.mean.data;
          
          //long range
            const longApiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=long_range`;
            const longResponse = await fetch(longApiUrl);
            if (!longResponse.ok) {
              throw new Error(`HTTP error status: ${longResponse.status} - ${longResponse.statusText}`);
            }
        
            const long_json_data = await longResponse.json();
        
            if (!long_json_data.longRange || !long_json_data.longRange.mean || !long_json_data.longRange.mean.data || long_json_data.longRange.mean.data.length === 0) {
                throw new Error("No forecast data available for this Reach ID.");
            }
            const longStreamflowData = long_json_data.longRange.mean.data;

          // Update the table
          const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
          table.innerHTML = "";
      
          for (let i = 0; i < shortStreamflowData.length; i++) {
            const row = table.insertRow();
            const timestampCell = row.insertCell();
            const flowCell = row.insertCell();
            timestampCell.textContent = timestamps[i];
            flowCell.textContent = flowValues[i];
          }

          var rank = (.9 * (flowValues.length + 1)) - 1;
          var thresholdValue;
          var sortedFlowValues = flowValues.toSorted(function(a, b){
            return a - b;
          });
          if(Number.isInteger(rank)){
            thresholdValue = flowValues[rank];
          }
          else{
            var lower = sortedFlowValues[Math.floor(rank)];
            var upper = sortedFlowValues[Math.ceil(rank)];
            thresholdValue = lower + ((rank - Math.floor(rank)) * (upper - lower));
          }
          var thresholdArray = new Array(flowValues.length).fill(thresholdValue);
          
          var lowerThreshold;
          var upperThreshold;
          switch (reachId) {
            case 1827842:
              lowerThreshold = 930.58;
              upperThreshold = 3063.23;
              break;
            case 5275740:
              lowerThreshold = 155.71;
              upperThreshold = 771.71;
              break;
            case 9660602:
              lowerThreshold = 723.64;
              upperThreshold = 2118.92;
              break;
            case 19180610:
              lowerThreshold = 952.42;
              upperThreshold = 3259.46;
              break
            case 24166358:
              lowerThreshold = 517.06
              upperThreshold = 1388.32
              break;
          }

          var lowerThresholdArray = new Array(flowValues.length).fill(lowerThreshold);
          var upperThresholdArray = new Array(flowValues.length).fill(upperThreshold);
      
          // Update or create the chart
          const ctx = document.getElementById('streamflowChart').getContext('2d');
          let chart = Chart.getChart('streamflowChart');
      
          if (chart) {
            chart.destroy();
          }
      
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: timestamps,
              datasets: [{
                label: 'Streamflow Forecast (Short Range)',
                data: flowValues,
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
              },
              {label: 'Streamflow Forecast (Medium Range)',
                data: thresholdArray,
                borderColor: 'black',
                borderWidth: 1,
                fill: false
              },
              {label: 'Streamflow Forecast (Long Range)',
                data: thresholdArray,
                borderColor: 'grey',
                borderWidth: 1,
                fill: false
              },
              {label: 'Flood Warning',
                data: upperThresholdArray,
                borderColor: 'red',
                borderWidth: 1,
                fill: false
              },
              {label: 'No water',
                data: lowerThresholdArray,
                borderColor: 'red',
                borderWidth: 1,
                fill: false
              }
              ]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Time'
                  }
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Streamflow'
                  }
                }
              }
            }
          });
      
        } catch (error) {
          console.error('Error fetching or processing data:', error);
          alert("Error fetching forecast: " + error.message);
      
          const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
          table.innerHTML = "";
      
          const chartCanvas = document.getElementById('streamflowChart');
          chartCanvas.innerHTML = "";
      
        }
      
    };

//adding hydroshare
const wmsLayer1 = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-efecdcd09f0d458b91f90ecd18c6df56/wms', {
  layers: 'HS-efecdcd09f0d458b91f90ecd18c6df56:All_Idaho_Road',
transparent: 'true',
format: 'image/png',
  attribution: 'Hydroshare GeoServer'})

const wmsLayer2 = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-efecdcd09f0d458b91f90ecd18c6df56/wms', {
    layers: 'HS-efecdcd09f0d458b91f90ecd18c6df56:ID305B_2010_LAKES',
transparent: 'true',
format: 'image/png',
    attribution: 'Hydroshare GeoServer'})

var wmsLayer1Added = L.layerGroup([wmsLayer1]);
var wmsLayer2Added = L.layerGroup([wmsLayer2]);
  
// Layers object
var overlays = { 
  "Rivers and Streams in Idaho": kmlLayer1Added,
  "Popular Rivers and Streams": kmlLayer2Added,
  "Idaho State Boundary": kmlLayer3Added,
  "Idaho Roads": wmsLayer1Added,
  "Lakes that meet quality standards (less/no pollution)": wmsLayer2Added,};

L.control.layers(null, overlays, { collapsed: false }).addTo(map);