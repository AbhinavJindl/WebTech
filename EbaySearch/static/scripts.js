const HOST = ''

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const params = validateForm();
    if (params === false) {
        return false;
    }
    clearResults();
    fetch_page_data(params);
})


function showResults() {
    const div1 = document.getElementById('item-container');
    div1.className = 'hidden'
    div1.innerHTML = ''
    const div2 = document.getElementById('card-container');
    div2.className = 'card-container';
}

function showItemDetails() {
    const div1 = document.getElementById('card-container');
    div1.className = 'hidden'
    const div2 = document.getElementById('item-container');
    div2.className = 'item-container';
    div2.innerHTML = ''
}

/*
how to clear results on button click? (3 lines). ChatGPT, 4 Sep. version, OpenAI, 01 Oct. 2023, chat.openai.com/chat.
*/
document.getElementById('clear-btn').addEventListener('click', function() {
    document.getElementById('searchForm').reset();
    clearResults();
});

/*
how to clear results on button click? (2 lines). ChatGPT, 4 Sep. version, OpenAI, 01 Oct. 2023, chat.openai.com/chat.
*/
function clearResults() {
    document.getElementById('card-container').innerHTML = '';
    document.getElementById('item-container').innerHTML = '';
}

function validateForm() {
    const keywords = document.getElementById('keywords').value;
    const sortOrder = document.getElementById('sortBy').value;

    params = {
        keywords,
        sortOrder,
    }

    let minPrice = document.getElementById('minPrice').value;
    if (minPrice) {
        minPrice = parseFloat(minPrice);
        if (minPrice < 0) {
            alert('Price Range values cannot be negative! Please try a value greater than or equal to 0.0');
            return false;
        }
    }
    let maxPrice = parseFloat(document.getElementById('maxPrice').value);
    if (maxPrice) {
        maxPrice = parseFloat(maxPrice);
        if (maxPrice < 0) {
            alert('Price Range values cannot be negative! Please try a value greater than or equal to 0.0');
            return false;
        }
    }

    if (minPrice && maxPrice) {
        if (minPrice > maxPrice) {
            alert('Oops! Lower price limit cannot be greater than upper price limit! Please try again.');
            return false;
        }

        params['minPrice'] = minPrice;
        params['maxPrice'] = maxPrice;
    }

    const newCheckbox = document.getElementById("new");
    const usedCheckbox = document.getElementById("used");
    const veryGoodCheckbox = document.getElementById("veryGood");
    const goodCheckbox = document.getElementById("good");
    const acceptableCheckbox = document.getElementById("acceptable");
    if (newCheckbox.checked) {
        params['conditionNew'] = 'true'
    }
    if (usedCheckbox.checked) {
        params['conditionUsed'] = 'true'
    }
    if (veryGoodCheckbox.checked) {
        params['conditionVeryGood'] = 'true'
    }
    if (goodCheckbox.checked) {
        params['conditionGood'] = 'true'
    }
    if (acceptableCheckbox.checked) {
        params['conditionAcceptable'] = 'true'
    }

    const returnsAcceptedCheckbox = document.getElementById("returnsAccepted");
    if (returnsAcceptedCheckbox.checked) {
        params['returnsAccepted'] = 'true'
    }

    const freeShippingCheckbox = document.getElementById("freeShipping");
    if (freeShippingCheckbox.checked) {
        params['freeShipping'] = 'true'
    }

    const expeditedShippingCheckbox = document.getElementById("expeditedShipping");
    if (expeditedShippingCheckbox.checked) {
        params['expeditedShipping'] = 'true'
    }

    return params

}

async function fetch_page_data(params) {
    try {
        
        let url = HOST + `/find_items_advanced`
        const queryString = new URLSearchParams(params).toString();
        const urlWithParams = `${url}?${queryString}`;
        let response = await fetch(urlWithParams);
        let data = await response.json();
        const totalEntries = data['paginationOutput']['totalEntries'][0]
        const items = data['searchResult']['item']
        loadPageData(items, totalEntries, keywords);
        return data;
    } catch(error) {
        console.log(error);
        return "Error encountered while fetching data."
    } 
    
}

function showLessData() {
    const allCardItems = document.querySelectorAll('.card');
    const showMoreButton = document.getElementById('show-more-button');
    for (let i = 3; i < allCardItems.length; i++) {
        allCardItems[i].style.display = 'none';
    }
    showMoreButton.textContent = 'Show More';
    showMoreButton.onclick = showMoreData;
    window.scrollTo({
        top: -document.documentElement.scrollHeight,
        behavior: 'smooth'
    });   

}

function showMoreData() {
    const allHiddenItems = document.querySelectorAll('.card');
    const showMoreButton = document.getElementById('show-more-button');
    for (let i = 0; i < allHiddenItems.length; i++) {
        allHiddenItems[i].style.display = 'flex';
    }
    showMoreButton.textContent = 'Show Less';
    showMoreButton.onclick = showLessData;
    /*
    scroll to bottom of page using js (3 lines). ChatGPT, 4 Sep. version, OpenAI, 01 Oct. 2023, chat.openai.com/chat.
    */
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });            
      
}

function validateItem(item) {
    if (!item.title || item.title.length == 0 || item.title[0].trim() == "") {
        return false
    }
    return true
}

function stopPropagate(e) {
    e.stopPropagation();
}

/*
display the response of some objects list from API as cards in HTML frontend using JS (20 lines). ChatGPT, 4 Sep. version, OpenAI, 01 Oct. 2023, chat.openai.com/chat.
*/
function loadPageData(itemsList, totalItems, keywords) {
    showResults();
    const container = document.getElementById('card-container');
    const header = document.createElement('div');
    if (totalItems == 0 || itemsList.length == 0) {
        const spanText = document.createElement('span');
        spanText.textContent = `No Results found`;
        header.className = 'items-header';
        header.appendChild(spanText);
        container.appendChild(header);
        return;
    }
    const spanText = document.createElement('span');
    spanText.textContent = `${totalItems} Results found for `;
    const italicText = document.createElement('em');
    italicText.textContent = keywords.value;
    header.className = 'items-header';
    header.appendChild(spanText);
    header.appendChild(italicText);
    container.appendChild(header);

    const horizantalLine = document.createElement('div');
    horizantalLine.className = 'horizontal-line';
    container.appendChild(horizantalLine);

    itemsList = itemsList.filter(item => validateItem(item));
    // Iterate over the list of objects
    for (let i=0; i< Math.min(itemsList.length, 10); i++) {
        const item = itemsList[i]
        const card = document.createElement('div');
        card.onclick = function() {
            loadSingleItemData(item.itemId[0])
        };
        card.className = 'card';

        const cardImgContainer = document.createElement('div');
        cardImgContainer.className = 'card-img-container'
        const cardImg = document.createElement('img');
        cardImg.className = 'card-img';

        if (!item.galleryURL || item.galleryURL.length == 0 || item.galleryURL[0].trim() == "") {
            cardImg.src = 'https://csci571.com/hw/hw6/images/ebay_default.jpg'
        } else {
            cardImg.src = item.galleryURL[0];
        }
        cardImgContainer.appendChild(cardImg);
        card.appendChild(cardImgContainer);

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';


        const cardTitle = document.createElement('div');
        cardTitle.className = 'card-title';
        cardTitle.textContent = item.title[0];
        cardContent.appendChild(cardTitle);
        

        try {
            if (item.primaryCategory && item.primaryCategory.length > 0 && item.primaryCategory[0].categoryName && item.primaryCategory[0].categoryName.length > 0 && item.primaryCategory[0].categoryName[0].trim() !== "") {
                const cardBody1 = document.createElement('div');
                cardBody1.className = 'card-body';
                cardBody1.textContent = "Category:"
                cardBody1.innerHTML += "&nbsp;"
                const italicText = document.createElement('em');
                italicText.textContent = item.primaryCategory[0].categoryName[0];
                cardBody1.appendChild(italicText);
                cardContent.appendChild(cardBody1);

                if (!(!item.viewItemURL || item.viewItemURL.length == 0 || item.viewItemURL[0].trim() == "")) {
                    const stopPropagation = document.createElement('div')
                    stopPropagation.onclick = stopPropagate
                    const redirectImg = document.createElement('a')
                    redirectImg.href = item.viewItemURL[0]
                    redirectImg.setAttribute("target", "_blank");
                    const itemRedirectImg = document.createElement('img');
                    itemRedirectImg.src = 'https://csci571.com/hw/hw6/images/redirect.png'
                    itemRedirectImg.className = 'redirect-img';
                    redirectImg.appendChild(itemRedirectImg);
                    stopPropagation.appendChild(redirectImg);
                    cardBody1.appendChild(stopPropagation);
                }
            }
        } catch (e) {
            console.log(e);
        }


        try {
            if (!(!item.condition || item.condition.length == 0 || !item.condition[0].conditionDisplayName || item.condition[0].conditionDisplayName.length == 0 || item.condition[0].conditionDisplayName[0].trim() == "")) {
                const cardBody2 = document.createElement('div');
                cardBody2.className = 'card-body';
                cardBody2.textContent = `Condition: ${item.condition[0].conditionDisplayName[0]}`;
                cardContent.appendChild(cardBody2);

                if (item.topRatedListing && item.topRatedListing.length > 0 && item.topRatedListing[0] === "true") {
                    const topRatedImg = document.createElement('img');
                    topRatedImg.className = 'top-rated-img';
                    topRatedImg.src = 'https://csci571.com/hw/hw6/images/topRatedImage.png';
                    cardBody2.appendChild(topRatedImg);
                }
            }
        } catch (e) {
            console.log(e);
        }

        try {
            if (!(!item.sellingStatus || item.sellingStatus.length == 0 || !item.sellingStatus[0].convertedCurrentPrice || item.sellingStatus[0].convertedCurrentPrice.length == 0)) {
                const priceContent = document.createElement('div');
                priceContent.className = 'card-title';
                priceContent.textContent = `Price: $${item.sellingStatus[0].convertedCurrentPrice[0].__value__}`
                if (!(!item.shippingInfo || item.shippingInfo.length == 0 || !item.shippingInfo[0].shippingServiceCost || item.shippingInfo[0].shippingServiceCost.length == 0)) {
                    const shipping_cost = item.shippingInfo[0].shippingServiceCost[0].__value__
                    if (shipping_cost >= 0.01) {
                        priceContent.textContent = priceContent.textContent + ` (+ $${shipping_cost} for shipping)`
                    }
                }
                
                cardContent.appendChild(priceContent);
            }
        } catch (e) {
            console.log(e);
        }
        

        card.appendChild(cardContent);

        if (i>=3) {
            card.style.display = 'none';
        }

        container.appendChild(card);
    }

    showMoreButton = document.createElement('button');
    showMoreButton.id = 'show-more-button';
    showMoreButton.textContent = 'Show More';
    showMoreButton.onclick = showMoreData;
    container.appendChild(showMoreButton)
}


async function loadSingleItemData(id) {
    try {
        let url = HOST + `/get_single_item`
        params = {'id': id}
        const queryString = new URLSearchParams(params).toString();
        const urlWithParams = `${url}?${queryString}`;
        let response = await fetch(urlWithParams);
        let data = await response.json();
        showItemDetails();

        const itemContainer = document.getElementById('item-container');
        const itemDetailHeader = document.createElement('div');
        itemDetailHeader.className = 'items-header';
        itemDetailHeader.textContent = 'Item Details';
        itemContainer.appendChild(itemDetailHeader);
        const goBackbutton = document.createElement('button');
        goBackbutton.className = 'back-to-results';
        goBackbutton.textContent = 'Back to search results';
        goBackbutton.onclick = showResults;
        itemContainer.appendChild(goBackbutton);
    

        const table = document.createElement('table');
        data = data.Item;

        let returnPolicyText = ''
        if (data.ReturnPolicy.ReturnsAccepted) {
            returnPolicyText = returnPolicyText + data.ReturnPolicy.ReturnsAccepted + ' '
        }
        if (data.ReturnPolicy.ReturnsWithin) {
            returnPolicyText = returnPolicyText + `within ${data.ReturnPolicy.ReturnsWithin}`
        }

        itemObject = {}

        if (data.Title) {
            itemObject['Title'] = data.Title
        }

        if (data.CurrentPrice.Value && data.CurrentPrice.CurrencyID) {
            itemObject['Price'] = `${data.CurrentPrice.Value} ${data.CurrentPrice.CurrencyID}`
        }

        if (data.Location && data.PostalCode) {
            itemObject['Location'] = `${data.Location}, ${data.PostalCode}`
        }

        if (data.Seller.UserID) {
            itemObject['Seller'] = data.Seller.UserID
        }

        if (returnPolicyText) {
            itemObject['Return Policy(US)'] = returnPolicyText
        }

        const itemSpecifics = data.ItemSpecifics.NameValueList;

        for (let itemSpecific in itemSpecifics) {
            try {
                if (itemSpecifics[itemSpecific].Value[0]) {
                    itemObject[itemSpecifics[itemSpecific].Name] = itemSpecifics[itemSpecific].Value[0]
                }
            }
            catch (e) {
                console.log(e)
            }
            
        }

        const imageRow = document.createElement('tr');
        const imageRowKeyCell = document.createElement('td');
        imageRowKeyCell.textContent = "Photo";
        imageRowKeyCell.className = 'item-table-key';

        const imageRowValueCell = document.createElement('td');
        imageRowValueCell.className = 'item-table-value';
        const imageRowValueImg = document.createElement('img');
        if (!data.PictureURL || data.PictureURL.length == 0) {
            imageRowValueImg.src = 'https://csci571.com/hw/hw6/images/ebay_default.jpg'
        } else {
            imageRowValueImg.src = data.PictureURL[0];
        }
        imageRowValueImg.className = "item-img";
        imageRowValueCell.appendChild(imageRowValueImg);
        imageRow.appendChild(imageRowKeyCell);
        imageRow.appendChild(imageRowValueCell);
        table.appendChild(imageRow);

        const linkRow = document.createElement('tr');
        const linkKeyCell = document.createElement('td');
        linkKeyCell.textContent = "Photo";
        linkKeyCell.className = 'item-table-key';

        const linkValueCell = document.createElement('td');
        linkValueCell.className = 'item-table-value';
        const valueLink = document.createElement('a');
        valueLink.href = data.ViewItemURLForNaturalSearch;
        valueLink.textContent = "eBay Product Link"
        valueLink.setAttribute("target", "_blank");
        linkValueCell.appendChild(valueLink);
        linkRow.appendChild(linkKeyCell);
        linkRow.appendChild(linkValueCell);
        table.appendChild(linkRow);

        for (let key in itemObject) {
            const row = document.createElement('tr');

            const keyCell = document.createElement('td');
            keyCell.textContent = key;
            keyCell.className = 'item-table-key';

            const valueCell = document.createElement('td');
            valueCell.className = 'item-table-value';
            valueCell.textContent = itemObject[key];
            row.appendChild(keyCell);
            row.appendChild(valueCell);
            table.appendChild(row);
        }
        table.className = 'item-detail-table';
        itemContainer.appendChild(table);
    } catch(error) {
        console.log(error);
        return "Error encountered while fetching data."
    } 
}
