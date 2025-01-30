  // Initialize the map and set its view
      var map = L.map("map").setView([1.417, 103.831], 13) // yishun view

      // Add a tile layer (e.g., OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)
      // add circle in 808 (Childhood Home) and a polygon
      var circle = L.circle([1.4168265075156221, 103.83091409521965], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.25,
        radius: 250, // 10 km in meters
      }).addTo(map)
      circle.bindPopup("Childhood home")
      
      const polygonCoordinates1 = [
      [1.416991, 103.830535], // Point 1
      [1.416650, 103.831249], // Point 2
      [1.416852, 103.831323], // Point 3
      [1.417198, 103.830679], // Closing the shape (optional, Leaflet automatically closes polygons)
    ];
    const polygon1 = L.polygon(polygonCoordinates1, {
      color: '#AF7C7B',       // Outline color
      weight: 2,       // Outline thickness
      fill: false,   // Fill color
    }).addTo(map);
    // end

   // add circle in YSS and a polygon
      var circle = L.circle([1.4281, 103.8288], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.25,
        radius: 250, // 10 km in meters
      }).addTo(map)
      circle.bindPopup("Secondary School")
      
      const polygonCoordinates2 = [
      [1.427380, 103.829570], // Point 1
      [1.428608, 103.829497], // Point 2
      [1.428527, 103.828449], // Point 3
      [1.427313, 103.828532], // Point 4
    ];
    const polygon2 = L.polygon(polygonCoordinates2, {
      color: '#AF7C7B',       // Outline color
      weight: 2,       // Outline thickness
      fill: false,   // Fill color
    }).addTo(map);
      // End
      
      // add circle in church and a polygon
      var circle = L.circle([1.3149675340501847, 103.83673087931395], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.25,
        radius: 250, // 10 km in meters
      }).addTo(map)
      circle.bindPopup("Church")
      
      const polygonCoordinates4 = [
      [1.314653, 103.836562], // Point 1
      [1.314730, 103.836478], // Point 2
      [1.315060, 103.836784], // Point 3
      [1.314931, 103.836896], // Point 4
    ];
    const polygon4 = L.polygon(polygonCoordinates4, {
      color: '#AF7C7B',       // Outline color
      weight: 2,       // Outline thickness
      fill: false,   // Fill color
    }).addTo(map);
      // End
      
        // add circle in Springleaf and a polygon
      var circle = L.circle([1.3970409407722897, 103.81883921073315], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.25,
        radius: 250, // 10 km in meters
      }).addTo(map)
      circle.bindPopup("Yummy Prata Place")
      
      const polygonCoordinates3 = [
      [1.397029, 103.819009], // Point 1
      [1.397126, 103.818968], // Point 2
      [1.397072, 103.818739], // Point 3
      [1.3969865899589178, 103.81876795827543], // Point 4
    ];
    const polygon3 = L.polygon(polygonCoordinates3, {
      color: '#AF7C7B',       // Outline color
      weight: 2,       // Outline thickness
      fill: false,   // Fill color
    }).addTo(map);
      // End
      
     // Clickable Circle
    	 // Define the circle's center and radius
    const circleCenter = [1.3521, 103.8198]; // Singapore
    const radius = 200000; // Radius in meters (200 km)

   		 // Create the circle
    const circle1 = L.circle(circleCenter, {
      color: 'red',        // Outline color
      fill: false,
      weight: 20, 
      radius: radius,       // Radius in meters
    }).addTo(map);

      // Add a click event listener to the circle
    circle1.on('click', () => {
      // Zoom to the circle's center with a specific zoom level
      map.setView(circleCenter, 10); // 10 is the zoom level

      // Optional: Add a popup to the circle
      circle1.bindPopup("Welcome to Singapore!").openPopup();
    });
    
     // Adding the markers for the GC Distance
      let smarker, emarker, route
      document
        .getElementById("gcdistance")
        .addEventListener("click", function () {
          var slat = parseFloat(document.getElementById("slatitude").value)
          var slong = parseFloat(document.getElementById("slongitude").value)
          var elat = parseFloat(document.getElementById("elatitude").value)
          var elong = parseFloat(document.getElementById("elongitude").value)

          if (smarker) {
            map.removeLayer(smarker)
            smarker = null
          }

          if (emarker) {
            map.removeLayer(emarker)
            emarker = null
          }

          if (route) {
            map.removeLayer(route)
            route = null
          }

          smarker = L.circle([slat, slong], {
            color: "blue",
            fillColor: "#bffffc",
            fillOpacity: 0.25,
            radius: 50, // 10 km in meters
          }).addTo(map)
          smarker.bindPopup("Marker at [" + slat + ", " + slong + "]")

          emarker = L.circle([elat, elong], {
            color: "blue",
            fillColor: "#bffffc",
            fillOpacity: 0.25,
            radius: 50, // 10 km in meters
          }).addTo(map)
          emarker.bindPopup("Marker at [" + elat + ", " + elong + "]")

          const bounds = L.latLngBounds([
            [slat, slong],
            [elat, elong],
          ])
          map.fitBounds(bounds)


          function compute_distance(lat1, lng1, lat2, lng2) {
            const R = 6371 // Earth's radius in km
            const radLat1 = (lat1 * Math.PI) / 180
            const radLng1 = (lng1 * Math.PI) / 180
            const radLat2 = (lat2 * Math.PI) / 180
            const radLng2 = (lng2 * Math.PI) / 180
            const dLat = radLat2 - radLat1
            const dLon = radLng2 - radLng1
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const distance = R * c
            document.getElementById("results").innerHTML =
              "Distance = " + distance + " km"
            return c
          }

          angular_distance = compute_distance(slat, slong, elat, elong)

          function great_circle(lat1, lng1, lat2, lng2) {
            num_segments = 100
            const points = []

            radLat1 = (lat1 * Math.PI) / 180
            radLng1 = (lng1 * Math.PI) / 180
            radLat2 = (lat2 * Math.PI) / 180
            radLng2 = (lng2 * Math.PI) / 180

            for (let i = 0; i <= num_segments; i++) {
              const f = i / num_segments

              const A =
                Math.sin((1 - f) * angular_distance) /
                Math.sin(angular_distance)
              const B =
                Math.sin(f * angular_distance) / Math.sin(angular_distance)
              const x =
                A * Math.cos(radLat1) * Math.cos(radLng1) +
                B * Math.cos(radLat2) * Math.cos(radLng2)
              const y =
                A * Math.cos(radLat1) * Math.sin(radLng1) +
                B * Math.cos(radLat2) * Math.sin(radLng2)
              const z = A * Math.sin(radLat1) + B * Math.sin(radLat2)
              const newLat = Math.atan2(z, Math.sqrt(x ** 2 + y ** 2))
              const newLng = Math.atan2(y, x)
              
              points.push([newLat * 180 / Math.PI, newLng * 180 / Math.PI]);
            }
            route = L.polyline(points, { color: 'blue' }).addTo(map);
          }
          
          great_circle(slat, slong, elat, elong)
        })

// loading the kml file for iKEAs
 var kmlLayer = omnivore.kml('iKEA_Singapore_LayerToKML.kml') // Replace with your file path
            .on('ready', function() {
 var layer = kmlLayer.getLayers();
        
        layer.forEach(function(feature) {
            var props = feature.feature.properties;
            
            // Bind popup with name or description from KML
            feature.bindPopup(props.name || "No Name");
            
            // Bind tooltip (label) with name
            feature.bindTooltip(props.name || "Unnamed", { permanent: true, direction: "right" });
        });

        map.fitBounds(kmlLayer.getBounds()); // Adjust map to fit KML layer
    })
    .addTo(map);

//KML for UT County
 var kmlLayer = omnivore.kml('Utah County Major_LayerToKML.kml') // Replace with your file path
            .on('ready', function() {
 // var layer2 = kmlLayer.getLayers();
        
 //        layer2.forEach(function(feature) {
 //            var props2 = feature.feature.properties;
            
 //            // Bind popup with name or description from KML
 //            feature.bindPopup(props2.name || "No Name");
            
 //            // Bind tooltip (label) with name
 //            feature.bindTooltip(props2.name || "Unnamed", { permanent: true, direction: "right" });
 //        });
        })
    .addTo(map);
