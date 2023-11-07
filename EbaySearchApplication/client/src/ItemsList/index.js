import React from 'react';
import { Pagination } from 'react-bootstrap';
import styles from './styles.module.css'
import { connect } from 'react-redux';
import { items, incrementPage, decrementPage, setPage, pageNumber, isClear, isLoading } from '../features/resultsSlice';
import ItemsTable from './itemsTable';
import { isDetailPageOpen } from '../features/itemDetailSlice';
import ProgressBarComponent from '../ProgressBar';
import NoRecordsAlert from '../NoRecordsAlert';
import './normalStyles.css'

const ProductList = (props) => {
  const {isLoading, isClear, items, onDecrementPage, onIncrementPage, onSetPage, pageNumber, isDetailPageOpen} = props;

  const totalPages = () => {
    return Math.ceil(items.length/10);
  }

  const onPageClick = (number) => (e) => {
    onSetPage(number);
  }

  const paginationPages = () => {
    const pagesCount = totalPages();
    let pagesArray = [];
    for (let i=1;i<=pagesCount;i++) {
        pagesArray.push(<Pagination.Item onClick={onPageClick(i)} active={i===pageNumber}>{i}</Pagination.Item>)
    }

    return (
      <div className={styles.paginationContainer}>
        <Pagination>
            <Pagination.Prev disabled={pageNumber===1} onClick={onDecrementPage}>{'<< Previous'}</Pagination.Prev>
            {pagesArray}
            <Pagination.Next disabled={pageNumber===totalPages()} onClick={onIncrementPage}>{'Next >>'}</Pagination.Next>
        </Pagination>
      </div>
    )

  }

  const getCurrentPageItems = () => {
    let temp = items.slice((pageNumber-1)*10, pageNumber*10)
    return temp;
  }

  if (isClear || isDetailPageOpen) {
    return null
  }

  if (isLoading) {
    return <ProgressBarComponent/>
  }

  if (items.length === 0) {
    return <NoRecordsAlert/>
  }

  return (
    <div className={styles.tableContainer}>
      <ItemsTable
        items={getCurrentPageItems()} 
        isWishlistTab={false}
        offset={(pageNumber-1)*10}
      />
      {paginationPages()}
    </div>
  );
};

const mapStateToProps = state => ({
    items: items(state),
    pageNumber: pageNumber(state),
    isDetailPageOpen: isDetailPageOpen(state),
    isClear: isClear(state),
    isLoading: isLoading(state),
});
  
const mapDispatchToProps = dispatch => ({
    onIncrementPage: () => dispatch(incrementPage()),
    onDecrementPage: () => dispatch(decrementPage()),
    onSetPage: (number) => dispatch(setPage(number)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);