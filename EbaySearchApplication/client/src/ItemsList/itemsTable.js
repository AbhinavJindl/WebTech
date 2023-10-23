import React from 'react';
import { Table} from 'react-bootstrap';
import { connect } from 'react-redux';
import { wishlistItems } from '../features/resultsSlice';
import { getSingleItem, updateWishListItem } from '../Api';
const _ = require('lodash');

const ItemsTable = (props) => {
  const {items, wishlistItems, isWishlistTab, offset} = props;

  const onSpecificProductClick = (productId) => (e) => {
    getSingleItem(productId);
  }

  const onCartClick = (productId) => (e) => {
    updateWishListItem(productId);
  }

  const cartIcon = (productId) => {
     if (wishlistItems.find(item => item.itemId === productId)) {
        return (
            <i className="material-icons-outlined" onClick={onCartClick(productId)}>remove_shopping_cart</i>
        )
     }

     return (<i className="material-icons-outlined" onClick={onCartClick(productId)}>add_shopping_cart</i>)
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

  return (
    <>
      <Table hover className="table-dark table-striped">
        <thead>
          <tr>
            <th style={{width:'10%'}}>#</th>
            <th style={{width:'10%'}}>Image</th>
            <th style={{width:'30%'}}>Title</th>
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
                <span onClick={onSpecificProductClick(product.itemId)}>
                    {product.title}
                </span>
              </td>
              <td>${_.get(product, ['sellingStatus', 0, 'currentPrice', 0, '__value__'])}</td>
              <td>{_.get(product, ['shippingInfo', 0, 'shippingServiceCost', 0, '__value__'])}</td>
              {zipData(product)}
              <td>
                {cartIcon(product.itemId)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

const mapStateToProps = state => ({
    wishlistItems: wishlistItems(state),
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ItemsTable);