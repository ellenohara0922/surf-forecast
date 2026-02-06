const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  waveHeight: Object,
  swellHeight: Object,
  swellPeriod: Object,
  swellDirection: Object,
  windSpeed: Object,
  windDirection: Object,
  waterTemperature: Object,
  airTemperature: Object,
  time: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Forecast', ForecastSchema);
