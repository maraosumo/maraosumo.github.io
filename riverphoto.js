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
      
          const streamflowData = json_data.shortRange.series.data;
          const timestamps = streamflowData.map(item => item.validTime);
          const flowValues = streamflowData.map(item => item.flow);
      
          // Update the table
          const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
          table.innerHTML = "";
      
          for (let i = 0; i < streamflowData.length; i++) {
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
              {label: '90th percentile (Dangerous)',
                data: thresholdArray,
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
