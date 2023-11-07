import './App.css';
import axios from 'axios';
import { store } from './store';
import { setIsLoading, setClear,setCurrentLocation, setItems, setWishlistItems, updateWishlistItemState, setSuggestions} from './features/resultsSlice';
import { setDetailPageOpen, setDetails, setSimilarPhotos, setSimilarProducts } from './features/itemDetailSlice';
const _ = require('lodash');

const HOST = 'http://localhost:5000/'

const API_ENDPOINTS = {
    'IP_INFO': 'https://ipinfo.io/json?token=012967d69bb58a',
    'GET_ITEMS': `${HOST}ebay/find_items_advanced?`,
    'ITEM_DETAIL': `${HOST}ebay/get_single_item?`,
    'GEONAMES': `${HOST}geonames?`,
    'GET_SIMILAR_ITEMS': `${HOST}ebay/get_similar_items?`,
    'SIMILAR_PHOTOS': `${HOST}google/similar_photos?`,
    'WISHLIST': `${HOST}items`,
}


export const zipValidator = (val) => {
    return (val.trim() !== ""  && val.trim().length <= 5 && /^\d+$/.test(val))
}

export const fetchSuggestions = async (initialString) => {
    try {
        if (!(zipValidator(initialString)) || initialString.length > 5) {
            store.dispatch(setSuggestions([]));
            return
        }
        let url = API_ENDPOINTS.GEONAMES;
        url  = add_param(url, 'initialString', initialString)
        const response = await axios.get(url);
        let suggestions = _.map(_.get(response.data, "postalCodes", []), itm => _.get(itm, "postalCode", null));
        store.dispatch(setSuggestions(_.filter(suggestions, (it) => it!==null)));
    } catch (error) {
        console.error("Error fetching geonames:", error);
    }
}

export const fetchSimilarProducts = async (itemId) => {
    try {
        let url = API_ENDPOINTS.GET_SIMILAR_ITEMS;
        url  = add_param(url,'itemId', itemId)
        const response = await axios.get(url);
        store.dispatch(setSimilarProducts(_.get(response.data, ['getSimilarItemsResponse', 'itemRecommendations', 'item'], [])));
    } catch (error) {
        console.error("Error fetching similar products:", error);
    }
}

export const fetchCurrentLocation = async () => {
    try {
        let url = API_ENDPOINTS.IP_INFO;
        const response = await axios.get(url);
        store.dispatch(setCurrentLocation(_.get(response.data, 'postal', "90007")));
    } catch (error) {
        console.error("Error fetching wishlist items:", error);
    }
}

function add_param(url, key, value) {
    return `${url}&${key}=${value}`
}

export const fetchWishList = async () => {
    try {
        let url = API_ENDPOINTS.WISHLIST;
        const response = await axios.get(url);
        store.dispatch(setWishlistItems(response.data));
    } catch (error) {
        console.error("Error fetching wishlist items:", error);
    }
}

export const updateWishListItem = async (itemId) => {
    try {
        let item = store.getState().results.wishlistItems.find(item => item.itemId === itemId);
        if (item) {
            item = {...item, wishListed: !item.wishListed};
        } else {
            item = store.getState().results.items.find(item => item.itemId === itemId);
            if (!item) {
                throw Error('Item Detail not present');
            }
            item = { ...item, itemId: itemId, wishListed: true };
        }
        let url = API_ENDPOINTS.WISHLIST;
        const response = await axios.post(url, item);
        store.dispatch(updateWishlistItemState(response.data));
    } catch (error) {
        console.error("Error fetching wishlist items:", error);
    }
}


const getItemFromList = (itemId) => {
    const itemFromItems =  _.find(store.getState().results.items, {'itemId': itemId});
    if (itemFromItems) {
        return itemFromItems
    }
    const itemFromWishlist =  _.find(store.getState().results.wishlistItems, {'itemId': itemId});
    if (itemFromWishlist) {
        return itemFromWishlist
    }

    throw Error("Item not found in all items list");
}

const getCurrentItemShippingInfo = (itemId) => {
    const foundItem = getItemFromList(itemId);
    return _.get(foundItem, ['shippingInfo', 0], {})
}

export const fetchItems = async (keywords, postalCode, maxDistance, categoryId, freeShipping, localPickup, conditionNew, conditionUsed) => {
    try {
        store.dispatch(setClear(false));
        store.dispatch(setIsLoading(true));
        let url = add_param(API_ENDPOINTS.GET_ITEMS, 'keywords', keywords);
        url = add_param(url, 'buyerPostalCode', postalCode);
        url = add_param(url, 'maxDistance', maxDistance);
        if (categoryId !== "0") {
            url = add_param(url, 'categoryId', categoryId);
        }
        url = add_param(url, 'freeShipping', freeShipping);
        url = add_param(url, 'localPickup', localPickup);
        url = add_param(url, 'conditionNew', conditionNew);
        url = add_param(url, 'conditionUsed', conditionUsed);
        const response = await axios.get(url);
        const items = _.get(response.data, ['searchResult', 'item'], [])
        store.dispatch(setItems(items));
        store.dispatch(setIsLoading(false));
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

export async function getSingleItem(itemId) {
    try {
        store.dispatch(setIsLoading(true));
        store.dispatch(setDetailPageOpen(true));
        let url = add_param(API_ENDPOINTS.ITEM_DETAIL, 'itemId', itemId);
        const response = await axios.get(url);
        const detailData = _.get(response.data, 'Item', {});
        detailData['shippingInfo'] = getCurrentItemShippingInfo(itemId);
        const foundItem = getItemFromList(itemId);
        detailData['returnsAccepted'] = _.get(foundItem, ["returnsAccepted", 0], null)
        store.dispatch(setDetails(detailData));
        store.dispatch(setIsLoading(false));
        let itemTitle = _.get(response.data, ['Item', 'Title'], '');
        itemTitle = itemTitle.replace(/[^_ a-zA-Z0-9]/g, '');
        fetchSimilarPhotos(itemTitle);
        fetchSimilarProducts(itemId);
    } catch (error) {
        console.error("Error fetching items:", error);
        return {}
    }
}

export const fetchSimilarPhotos = async (text) => {
    try {
        let url = API_ENDPOINTS.SIMILAR_PHOTOS;
        url = add_param(url, 'queryText', text);
        const response = await axios.get(url);
        store.dispatch(setSimilarPhotos(response.data));
    } catch (error) {
        console.error("Error fetching similar photos:", error);
    }
}

