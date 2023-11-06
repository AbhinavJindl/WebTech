import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getSingleItem } from '../Api';
import './tableStyles.css';
import CartIcon from './cartIcon';
import { details, setDetailPageOpen } from '../features/itemDetailSlice';
const _ = require('lodash');

const ItemsTable = (props) => {
  const {items, isWishlistTab, offset, setDetailPageOpen, itemDetail} = props;

  const onSpecificProductClick = (productId) => (e) => {
    getSingleItem(productId);
  }

  const detailItemId = () => {
    return _.get(itemDetail, 'ItemID', null)
  }

  const zipHeader = () => {
    if (isWishlistTab) {
        return null;
    }
    return (
        <th style={{width:'15%'}}>Zip</th>
    )
  }

  const zipData = (product) => {
    if (isWishlistTab) {
        return null;
    }
    return (
        <td>{product.postalCode}</td>
    )
  }

  function shortenTitle(title) {
    const maxLength = 35;
    if (title.length > maxLength) {
        let cutTitle = title.substring(0, maxLength);
        const lastSpaceIndex = cutTitle.lastIndexOf(' ');
        
        if (lastSpaceIndex !== -1) {
            cutTitle = cutTitle.substring(0, lastSpaceIndex);
        }
        
        return cutTitle + '…';
    }
    return title;
  }

  const getShippingValue = (product) => {
    const shippingCost = _.get(product, ['shippingInfo', 0, 'shippingServiceCost', 0, '__value__'])
    if (shippingCost === "0.0") {
      return "Free Shipping"
    } else {
      return `$${shippingCost}`
    }
  }

  return (
    <>
      <Button disabled={detailItemId() === null} style={{"width": "7em", "float": "right", "margin-bottom": "10px"}} onClick={() => setDetailPageOpen(true)} className={`btn-spacing mr-5 btn-light btm-sm text-dark`}>
          {"Detail >"}
      </Button>
      <Table hover className="table-dark table-striped">
        <thead>
          <tr>
            <th style={{width:'5%'}}>#</th>
            <th style={{width:'15%'}}>Image</th>
            <th>Title</th>
            <th style={{width:'10%'}}>Price</th>
            <th style={{width:'15%'}}>Shipping</th>
            {zipHeader()}            
            <th style={{width:'10%'}}>Wish List</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product, index) => (
            <tr key={index}>
              <td>{offset + index+1}</td>
              <td>
                <a href={product.galleryURL[0]} target='_blank' rel="noreferrer">
                  <img src={product.galleryURL[0]} alt={product.title} width={100} height={100}/>
                </a>
              </td>
              <td>
                <span title={product.title[0]} className='title-link' onClick={onSpecificProductClick(product.itemId)}>
                    {shortenTitle(product.title[0])}
                </span>
              </td>
              <td>${_.get(product, ['sellingStatus', 0, 'currentPrice', 0, '__value__'])}</td>
              <td>{getShippingValue(product)}</td>
              {zipData(product)}
              <td>
                {<CartIcon productId = {product.itemId}/>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

const mapStateToProps = state => ({
  itemDetail: details(state),
});
  
const mapDispatchToProps = dispatch => ({
  setDetailPageOpen: (val) => dispatch(setDetailPageOpen(val)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ItemsTable);