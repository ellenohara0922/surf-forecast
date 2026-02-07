const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const forecastRoutes = require('./routes/forecast');
//const cron = require('node-cron');
//const fetchForecast = require('./utils/fetchForecast');
//require('./utils/fetchForecast')(); // 👈 TEMP: Call the fetch right now


dotenv.config();
const app = express();
app.get('/', (req, res) => {res.send('Surf Forecast API is running ✅ Try /api/forecast?lat=52.0864&lng=-10.1606');});
const cors = require("cors");

app.use(cors({
  origin: [
    "https://tritide.onrender.com",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));


app.use(express.json());
app.use('/api/forecast', forecastRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});

    })
    .catch(err => console.log(err));

// Fetch data every 6 hours
//cron.schedule('0 */6 * * *', fetchForecast);
