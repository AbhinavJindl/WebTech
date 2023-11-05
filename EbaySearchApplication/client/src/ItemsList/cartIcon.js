import React from 'react';
import { connect } from 'react-redux';
import { wishlistItems } from '../features/resultsSlice';
import { updateWishListItem } from '../Api';
import './tableStyles.css';
const _ = require('lodash');

const CartIcon = (props) => {
    const {wishlistItems, productId} = props;

    const onCartClick = (e) => {
        updateWishListItem(productId);
    }
    
    const cartIcon = () => {
        if (wishlistItems.find(item => item.itemId === productId)) {
            return (
                <i 
                    className="material-icons-outlined" 
                    onClick={onCartClick} 
                    style={{'color': '#ff9200b8',
                        'background': 'white',
                        'padding': '2px 6px',
                        'border-radius': '3px'}}
                >
                    remove_shopping_cart
                </i>
            )
        }
    
        return (
            <i 
            className="material-icons-outlined" 
            onClick={onCartClick}
            style={{'color': 'black',
                    'background': 'white',
                    'padding': '2px 6px',
                    'border-radius': '3px'}}
            >
                add_shopping_cart
            </i>
        )
    }
  
    return cartIcon();
  };
  
const mapStateToProps = state => ({
    wishlistItems: wishlistItems(state),
});

const mapDispatchToProps = dispatch => ({
});
    
export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);