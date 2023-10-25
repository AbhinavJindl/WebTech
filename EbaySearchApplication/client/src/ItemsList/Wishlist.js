import React from 'react';
import styles from './styles.module.css'
import { connect } from 'react-redux';
import { wishlistItems } from '../features/resultsSlice';
import ItemsTable from './itemsTable';
import NoRecordsAlert from '../NoRecordsAlert';

const Wishlist = (props) => {
  const {items} = props;

  if (items.length === 0) {
    return <NoRecordsAlert/>
  }

  return (
    <div className={styles.itemsListContainer}>
      <ItemsTable 
        items={items} 
        isWishlistTab={true}
        offset={0}/>
    </div>
  );
};

const mapStateToProps = state => ({
    items: wishlistItems(state),
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);