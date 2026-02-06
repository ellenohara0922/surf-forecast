const Forecast = require("../models/Forecast");
const axios = require("axios");

const CACHE_HOURS = 24; // with 10 requests/day, be stingy

exports.getForecast = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "lat and lng required" });

    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return res.status(400).json({ message: "lat and lng must be numbers" });
    }

    // 1) check cache in Mongo (same spot, recent enough)
    const cutoff = new Date(Date.now() - CACHE_HOURS * 60 * 60 * 1000);

    const cached = await Forecast.findOne({
      lat: latNum,
      lng: lngNum,
      timestamp: { $gte: cutoff },
    }).sort({ timestamp: -1 });

    if (cached) {
      return res.json({ ...cached.toObject(), source: "cache" });
    }

    // 2) not cached -> fetch from Stormglass (costs 1 request)
    const response = await axios.get("https://api.stormglass.io/v2/weather/point", {
      params: {
        lat: latNum,
        lng: lngNum,
        params:
          "waveHeight,swellHeight,swellPeriod,swellDirection,windSpeed,windDirection,waterTemperature,airTemperature",
        source: "noaa",
      },
      headers: { Authorization: process.env.STORMGLASS_API_KEY },
    });

    // choose hour closest to now (more correct than hours[0])
    const now = Date.now();
    const closest = response.data.hours.reduce((best, h) => {
      const diff = Math.abs(new Date(h.time).getTime() - now);
      return diff < best.diff ? { diff, hour: h } : best;
    }, { diff: Infinity, hour: null }).hour;

    if (!closest) return res.status(500).json({ message: "No forecast hours returned" });

    // 3) save to Mongo
    const saved = await Forecast.create({
      lat: latNum,
      lng: lngNum,
      waveHeight: closest.waveHeight,
      swellHeight: closest.swellHeight,
      swellPeriod: closest.swellPeriod,
      swellDirection: closest.swellDirection,
      windSpeed: closest.windSpeed,
      windDirection: closest.windDirection,
      waterTemperature: closest.waterTemperature,
      airTemperature: closest.airTemperature,
      time: closest.time,
      timestamp: new Date(),
    });

    return res.json({ ...saved.toObject(), source: "stormglass" });
  } catch (err) {
    console.error("getForecast error:", err.response?.data || err.message);
    res.status(500).json({ message: "Server error" });
  }
};