import React from 'react';
import { Table} from 'react-bootstrap';
import { connect } from 'react-redux';
import { getSingleItem } from '../Api';
import './tableStyles.css';
import CartIcon from './cartIcon';
const _ = require('lodash');

const ItemsTable = (props) => {
  const {items, isWishlistTab, offset} = props;

  const onSpecificProductClick = (productId) => (e) => {
    getSingleItem(productId);
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

  return (
    <>
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
                <img src={product.galleryURL[0]} alt={product.title} width={50}/>
              </td>
              <td>
                <span title={product.title[0]} className='title-link' onClick={onSpecificProductClick(product.itemId)}>
                    {shortenTitle(product.title[0])}
                </span>
              </td>
              <td>${_.get(product, ['sellingStatus', 0, 'currentPrice', 0, '__value__'])}</td>
              <td>{_.get(product, ['shippingInfo', 0, 'shippingServiceCost', 0, '__value__'])}</td>
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
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ItemsTable);