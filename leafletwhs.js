var map = L.map("map").setView([40.7608, -111.8910], 10) // View Centered on SLC

// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)
