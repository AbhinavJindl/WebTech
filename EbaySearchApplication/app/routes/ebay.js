const express = require('express');
const axios = require('axios');
const router = express.Router();
const oauthToken = require('./ebay_oauth_token');
const _ = require('lodash')

const APP_ID = "AbhinavJ-WebTech-PRD-6728e2735-0d69d3d7"
const APP_SECRET = "PRD-728e27357d6a-d19f-4efd-a790-d224"

const ITEMS_URL = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${APP_ID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50`
const SINGLE_ITEM_URL = `https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=${APP_ID}&siteId=0&version=967&IncludeSelector=Description,Details,ItemSpecifics`
const SIMILAR_ITEM_URL = `https://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=${APP_ID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&maxResults=20&itemId=394884844909`

function add_param(url, key, value) {
    return `${url}&${key}=${value}`
}

router.get('/find_items_advanced', async (req, res) => {
    try {
        const queryParams = req.query;
        let ebayReqQuery = ITEMS_URL;
        ebayReqQuery = add_param(ebayReqQuery, 'keywords', queryParams.keywords);
        ebayReqQuery = add_param(ebayReqQuery, 'buyerPostalCode', queryParams.buyerPostalCode);
        const categoryId = _.get(queryParams, 'categoryId', null);
        if (categoryId !== null) {
            ebayReqQuery = add_param(ebayReqQuery, 'categoryId', categoryId);
        }
        let i = 0

        const maxDistance = _.get(queryParams, 'maxDistance', null);
        if (maxDistance !== null) {
            ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).name`, 'MaxDistance');
            ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).value`, maxDistance);
            i += 1;
        }

        const freeShipping = _.get(queryParams, 'freeShipping', 'false');
        ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).name`, 'FreeShippingOnly');
        ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).value`, freeShipping);
        i += 1;

        const localPickup = _.get(queryParams, 'localPickup', 'false');
        ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).name`, 'LocalPickupOnly');
        ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).value`, localPickup);
        i += 1;

        ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).name`, 'HideDuplicateItems');
        ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).value`, 'true');
        i+=1

        // condition logic
        const conditionNew = _.get(queryParams, 'conditionNew', 'false') === 'true'
        const conditionUsed = _.get(queryParams, 'conditionUsed', 'false') === 'true'
        const conditionUnspecified = _.get(queryParams, 'conditionUnspecified', 'false') === 'true'

        if (conditionNew || conditionUsed){
            ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).name`, 'Condition');
            j = 0
            if (conditionNew) {
                ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).value(${j})`, 1000);
                j+=1
            }
            if (conditionUsed) {
                ebayReqQuery = add_param(ebayReqQuery, `itemFilter(${i}).value(${j})`, 3000);
                j+=1
            }
        }

        // output selectors
        ebayReqQuery = add_param(ebayReqQuery, 'outputSelector(0)', 'SellerInfo');
        ebayReqQuery = add_param(ebayReqQuery, `outputSelector(1)`, 'StoreInfo');

        const response = await axios.get(ebayReqQuery)
        console.error(ebayReqQuery);
        let data = response.data.findItemsAdvancedResponse[0]
        data['searchResult'][0]['item'] = _.map(data['searchResult'][0]['item'], 
            (item) => {
                return {...item, itemId: item.itemId[0]}
            }); 
        data = {'searchResult': data['searchResult'][0], 'paginationOutput': data['paginationOutput'][0]}
        res.send(data);
    } catch (error) {
        console.error("Could not get all Ebay items", error);
        res.status(500).send(error);
    }
    
});

// all items
router.get('/get_single_item', async (req, res) => {
    try {
        const accessToken = await oauthToken.getApplicationToken()
        const single_item_url = `${SINGLE_ITEM_URL}&ItemID=${req.query.itemId}`
        const response = await axios.get(
            single_item_url, 
            {
                headers: {
                    "X-EBAY-API-IAF-TOKEN": accessToken
                }
            });
        res.send(response.data);
    } catch (error) {
        console.error("Could not get single item info", error);
        res.status(500).send(error);
    }
});

router.get('/get_similar_items', async (req, res) => {
    try {
        const similar_item_url = `${SIMILAR_ITEM_URL}&itemId=${req.query.itemId}`
        const response = await axios.get(similar_item_url);
        res.send(response.data);
    } catch (error) {
        console.error("Could not get similar items", error);
        res.status(500).send(error);
    }
});


module.exports = router;
