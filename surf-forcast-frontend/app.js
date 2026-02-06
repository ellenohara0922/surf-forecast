const selector = document.getElementById('spotSelector');

// 1. Load surf spots from JSON and populate the dropdown
async function loadSpots() {
  const res = await fetch('surf-spots.json');
  const spots = await res.json();

  spots.forEach(spot => {
    const option = document.createElement('option');
    option.value = `${spot.lat},${spot.lng}`;
    option.textContent = spot.name;
    selector.appendChild(option);
  });

  // Auto-load the first spot's forecast
  const [lat, lng] = selector.options[0].value.split(',').map(Number);
  fetchForecast(lat, lng);
}

// 2. Handle selection change
selector.addEventListener('change', e => {
  const [lat, lng] = e.target.value.split(',').map(Number);
  fetchForecast(lat, lng);
});

// 3. Fetch forecast for given coordinates
async function fetchForecast(lat, lng) {
  try {
    const res = await fetch(`http://localhost:5000/api/forecast?lat=${lat}&lng=${lng}`);
    const data = await res.json();

    console.log("Forecast source:", data.source);
    console.log("Returned lat/lng:", data.lat, data.lng, "time:", data.time);

    document.getElementById('waveHeight').textContent = data.waveHeight?.noaa + ' m';
    document.getElementById('swellHeight').textContent = data.swellHeight?.noaa + ' m';
    document.getElementById('swellPeriod').textContent = data.swellPeriod?.noaa + ' sec';
    document.getElementById('swellDirection').textContent = data.swellDirection?.noaa + '°';
    document.getElementById('windSpeed').textContent = data.windSpeed?.noaa + ' m/s';
    document.getElementById('windDirection').textContent = data.windDirection?.noaa + '°';
    document.getElementById('airTemp').textContent = data.airTemperature?.noaa + '°C';
    document.getElementById('waterTemp').textContent = data.waterTemperature?.noaa + '°C';

  } catch (err) {
    console.error("Failed to fetch forecast:", err);
    document.getElementById('forecast').textContent = "⚠️ Failed to load forecast.";
  }
}

// Start the app
loadSpots();

