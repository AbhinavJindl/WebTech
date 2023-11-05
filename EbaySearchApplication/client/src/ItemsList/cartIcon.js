import React from 'react';
import { connect } from 'react-redux';
import { wishlistItems } from '../features/resultsSlice';
import { updateWishListItem } from '../Api';
import './tableStyles.css';

const CartIcon = (props) => {
    const {wishlistItems, productId} = props;

    const onCartClick = (e) => {
        updateWishListItem(productId);
    }

    let cartStyle = {
        'color': 'black',
        'background': '#f8f9fa',
        'padding': '2px 6px',
        'border-radius': '3px',
        'align-items': 'center',
        'display': 'flex',
        'width': '40px',
        'justify-content': 'center',
    }
    
    const cartIcon = () => {
        if (wishlistItems.find(item => item.itemId === productId)) {
            cartStyle['color'] = 'orange';
            return (
                <i 
                    className="material-icons-outlined" 
                    onClick={onCartClick} 
                    style={cartStyle}
                >
                    remove_shopping_cart
                </i>
            )
        }
    
        return (
            <i 
            className="material-icons-outlined" 
            onClick={onCartClick}
            style={cartStyle}
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