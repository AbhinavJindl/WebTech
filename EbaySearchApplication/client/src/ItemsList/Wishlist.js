import React from 'react';
import { connect } from 'react-redux';
import { wishlistItems } from '../features/resultsSlice';
import ItemsTable from './itemsTable';
import NoRecordsAlert from '../NoRecordsAlert';
import { isDetailPageOpen } from '../features/itemDetailSlice';

const Wishlist = (props) => {
  const {items, isDetailPageOpen} = props;

  if (isDetailPageOpen) {
    return null
  }

  if (items.length === 0) {
    return <NoRecordsAlert/>
  }

  return (
    <ItemsTable 
      items={items} 
      isWishlistTab={true}
      offset={0}/>
  );
};

const mapStateToProps = state => ({
    items: wishlistItems(state),
    isDetailPageOpen: isDetailPageOpen(state),
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);