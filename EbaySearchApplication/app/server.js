const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const itemsRoutes = require('./routes/items');
const ebayRoutes = require('./routes/ebay');
const googleRoutes = require('./routes/google');
const path = require('path')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/items', itemsRoutes);
app.use('/ebay', ebayRoutes);
app.use('/google', googleRoutes);

// "render a react build in node js server as a endpoint" (next 4 lines). ChatGPT, 25 Sep. version, OpenAI, 20 Oct. 2023, chat.openai.com/chat.
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


mongoose.connect('mongodb+srv://jindalab:Abhinav1998@cluster0.u53blox.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

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

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
