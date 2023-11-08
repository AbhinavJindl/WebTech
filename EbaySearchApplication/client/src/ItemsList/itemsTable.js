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
        <td className={tableDataClass(product.itemId)}>{_.get(product, 'postalCode', 'N/A')}</td>
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
    const shippingCost = _.get(product, ['shippingInfo', 0, 'shippingServiceCost', 0, '__value__'], 'N/A')
    if (shippingCost === "0.0") {
      return "Free Shipping"
    } else {
      return `$${shippingCost}`
    }
  }

  const tableDataClass = (itemId) => {
    return _.get(itemDetail, 'ItemID', null) === itemId && !isWishlistTab ? 'table-secondary': ''
  }

  const getTotalPrice = () => {
    let totalPrice = 0.0;

    if (!isWishlistTab) {
      return null;
    }

    _.forEach(items, item => {
      totalPrice += parseFloat(_.get(item, ['sellingStatus', 0, 'currentPrice', 0, '__value__'], 0.0))
    })

    return (
      <tr>
        <td></td><td></td><td></td><td></td>
        <td><b>Total Shopping</b></td>
        <td><b>{`$${totalPrice}`}</b></td>
      </tr>
    )

  }

  return (
    <>
      <Button disabled={detailItemId() === null} style={{"width": "7em", "float": "right", "margin-bottom": "10px"}} onClick={() => setDetailPageOpen(true)} className={`btn-spacing mr-5 btn-light btm-sm text-dark`}>
          {"Detail >"}
      </Button>
      <div style={{"width": "100%", "overflow-x": "auto"}}>
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
              <td className={tableDataClass(product.itemId)}>{offset + index+1}</td>
              <td className={tableDataClass(product.itemId)}>
                <a href={product.galleryURL[0]} target='_blank' rel="noreferrer">
                  <img src={product.galleryURL[0]} alt={product.title} width={100} height={100}/>
                </a>
              </td>
              <td className={tableDataClass(product.itemId)}>
                <span title={product.title[0]} className='title-link d-inline-block text-truncate' onClick={onSpecificProductClick(product.itemId)}>
                    {shortenTitle(_.get(product, ['title', 0], 'N/A'))}
                </span>
              </td>
              <td className={tableDataClass(product.itemId)}>${_.get(product, ['sellingStatus', 0, 'currentPrice', 0, '__value__'], 'N/A')}</td>
              <td className={`${tableDataClass(product.itemId)} text-truncate`}>{getShippingValue(product)}</td>
              {zipData(product)}
              <td className={tableDataClass(product.itemId)}>
                {<CartIcon productId = {product.itemId}/>}
              </td>
            </tr>
          ))}
          {getTotalPrice()}
        </tbody>
      </Table>
      </div>
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