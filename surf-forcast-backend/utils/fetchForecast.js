const axios = require('axios');
const Forecast = require('../models/Forecast');
require('dotenv').config();

module.exports = async function fetchForecast() {
    try {
        const response = await axios.get('https://api.stormglass.io/v2/weather/point', {
            params: {
                lat: 34.01,
                lng: -118.49,
                params: 'waveHeight,swellHeight,swellPeriod,swellDirection,windSpeed,windDirection,waterTemperature,airTemperature',
                source: 'noaa'
            },
            headers: {
                Authorization: process.env.STORMGLASS_API_KEY
            }
        });

        const data = response.data.hours[0]; // get the first hour's forecast
        await Forecast.create({ ...data, lat: 34.01, lng: -118.49, timestamp: new Date() });


        console.log('Forecast data saved');
    } catch (err) {
        console.error('Error fetching forecast:', err.message);
    }
};
