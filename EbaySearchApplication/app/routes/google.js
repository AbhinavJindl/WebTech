const express = require('express');
const axios = require('axios');
const router = express.Router();
const _ = require('lodash');
const KEY = 'AIzaSyDdemV1AfZ0F8UNH-n6cJ7rAh9_XVTroNQ';
const SERVICE = '748697140b4c447fb';

const URL = `https://www.googleapis.com/customsearch/v1?cx=${SERVICE}&imgSize=huge&imgType=photo&num=8&searchType=image&key=${KEY}`

// all items
router.get('/similar_photos', async (req, res) => {
    try {
        const url = `${URL}&q=${req.query.queryText}`
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error("Could not get photos", error);
        res.status(500).send(error);
    }
});

module.exports = router;
