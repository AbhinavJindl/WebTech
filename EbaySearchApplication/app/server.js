const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const itemsRoutes = require('./routes/items');
const ebayRoutes = require('./routes/ebay');
const googleRoutes = require('./routes/google');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/items', itemsRoutes);
app.use('/ebay', ebayRoutes);
app.use('/google', googleRoutes);

mongoose.connect('mongodb://localhost:27017/ebaySearch', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello from server. Do something Useful with this!!!');
});

app.get('/geonames', async (req, res) => {
    try {
        const queryParams = req.query;
        const response = await axios.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${queryParams.initialString}&maxRows=5&username=jindalab&country=US`);
        res.send(response.data);
    } catch (error) {
        console.error("Could not get geonames", error);
        res.status(500).send(error);
    }
    
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
