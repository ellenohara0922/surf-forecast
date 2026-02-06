const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const forecastRoutes = require('./routes/forecast');
//const cron = require('node-cron');
//const fetchForecast = require('./utils/fetchForecast');
//require('./utils/fetchForecast')(); // 👈 TEMP: Call the fetch right now


dotenv.config();
const app = express();
const cors = require('cors');
app.use(cors());

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
