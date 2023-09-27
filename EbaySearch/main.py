from flask import Flask, jsonify, request, send_from_directory
from ebay_oauth_token import OAuthToken
from flask_api import status
import requests
import os

app = Flask(__name__)

APP_ID = "AbhinavJ-WebTech-PRD-6728e2735-0d69d3d7"
APP_SECRET = "PRD-728e27357d6a-d19f-4efd-a790-d224"

URL = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME={app_id}&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD"
SINGLE_ITEM_URL = "https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid={app_id}&siteId=0&version=967&ItemID={item_id}&IncludeSelector=Description,Details,ItemSpecifics"

@app.route('/')
def render_html():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/find_items_advanced", methods=["GET"])
def find_items_advanced():
    url = URL.format(app_id=APP_ID)
    keywords = request.args.get('keywords')
    if keywords is None or keywords.strip() == '':
        return "Keywords cannot be empty", status.HTTP_400_BAD_REQUEST
    sort_order = request.args.get('sortOrder')
    if sort_order not in ['BestMatch', 'CurrentPriceHighest', 'PricePlusShippingHighest', 'PricePlusShippingLowest']:
        return "Sort Order not correct", status.HTTP_400_BAD_REQUEST
    
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')

    if min_price:
        min_price = float(min_price)
        if min_price < 0:
            return "Min Price not correct", status.HTTP_400_BAD_REQUEST

    if max_price:
        max_price = float(max_price)
        if max_price < 0:
            return "Max Price not correct", status.HTTP_400_BAD_REQUEST

    if min_price and max_price:
        if max_price < min_price:
            return "Price not correct", status.HTTP_400_BAD_REQUEST
    returns_accepted = request.args.get('returnsAccepted', 'false')
    free_shipping = request.args.get('freeShipping', 'false')
    expedited_shipping = request.args.get('expeditedShipping', 'false') == 'true'
    condition_new = request.args.get('conditionNew', 'false') == 'true'
    condition_used = request.args.get('conditionUsed', 'false') == 'true'
    condition_very_good = request.args.get('conditionVeryGood', 'false') == 'true'
    condition_good = request.args.get('conditionGood', 'false') == 'true'
    condition_acceptable = request.args.get('conditionAcceptable', 'false') == 'true'
    condition = False
    if condition_new or condition_used or condition_good or condition_very_good or condition_acceptable:
        condition = True
    params = {
        'keywords': keywords,
        'paginationInput.entriesPerPage': 100,
        'sortOrder': sort_order,
        'itemFilter(0).name': 'ReturnsAcceptedOnly',
        'itemFilter(0).value': returns_accepted,
        'itemFilter(1).name': 'FreeShippingOnly',
        'itemFilter(1).value': free_shipping,
    }
    i=2
    if min_price:
        params['itemFilter({}).name'.format(i)] = 'MinPrice'
        params['itemFilter({}).value'.format(i)] = min_price
        params['itemFilter({}).paramName'.format(i)] = 'Currency'
        params['itemFilter({}).paramValue'.format(i)] = 'USD'
        i+=1

    if max_price:
        params['itemFilter({}).name'.format(i)] = 'MaxPrice'
        params['itemFilter({}).value'.format(i)] = max_price
        params['itemFilter({}).paramName'.format(i)] = 'Currency'
        params['itemFilter({}).paramValue'.format(i)] = 'USD'
        i+=1

    if expedited_shipping:
        params['itemFilter({}).name'.format(i)] = 'ExpeditedShippingType'
        params['itemFilter({}).value'.format(i)] = 'Expedited'
        i+=1
    if condition:
        params['itemFilter({}).name'.format(i)] = 'Condition'
        j = 0
        if condition_new:
            params['itemFilter({}).value({})'.format(i, j)] = 1000
            j+=1
        if condition_used:
            params['itemFilter({}).value({})'.format(i, j)] = 3000
            j+=1
        if condition_very_good:
            params['itemFilter({}).value({})'.format(i, j)] = 4000
            j+=1
        if condition_good:
            params['itemFilter({}).value({})'.format(i, j)] = 5000
            j+=1
        if condition_acceptable:
            params['itemFilter({}).value({})'.format(i, j)] = 6000
            j+=1

    try:
        response = requests.get(url, params=params)
        data = response.json()['findItemsAdvancedResponse'][0]
        data = {'searchResult': data['searchResult'][0], 'paginationOutput': data['paginationOutput'][0]}
        return jsonify(data)
    except Exception as e:
        return "API call failed" + e, status.HTTP_500_INTERNAL_SERVER_ERROR


@app.route("/get_single_item", methods=["GET"])
def get_single_item():
    id = request.args.get('id')
    if id is None:
        return "ID is required", status.HTTP_400_BAD_REQUEST
    id = int(id)
    url = SINGLE_ITEM_URL.format(app_id=APP_ID, item_id=id)
    oauth_utility = OAuthToken(APP_ID, APP_SECRET)
    try:
        headers = {
            "X-EBAY-API-IAF-TOKEN": oauth_utility.getApplicationToken()
        }
        response = requests.get(url, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return "Get Single Item API call failed" + e, status.HTTP_500_INTERNAL_SERVER_ERROR


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("PORT", 8080), debug=True)
