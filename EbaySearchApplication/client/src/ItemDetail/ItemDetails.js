import React from 'react';
import styles from './styles.module.css'
import { connect } from 'react-redux';
import { items, isClear, isLoading } from '../features/resultsSlice';
import { details, isDetailPageOpen, similarPhotos, similarProducts } from '../features/itemDetailSlice';
import Product from './Product';
import { Tab, Nav } from 'react-bootstrap';
import ProgressBarComponent from '../ProgressBar';
import Photos from './Photos';
import Shipping from './Shipping';
import Seller from './Seller';
import SimilarProducts from './SimilarProducts';

const ItemDetails = (props) => {
  const {similarProducts, isClear, items, item, isDetailPageOpen, isLoading, similarPhotos} = props;

  if (isClear || !isDetailPageOpen) {
    return null
  }

  if (isLoading) {
    return <ProgressBarComponent/>
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tabsSection}>
            <Tab.Container defaultActiveKey="Product">
                <Nav variant="pills">
                  <Nav.Item>
                      <Nav.Link eventKey="Product">Product</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="Photos">Photos</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="Shipping">Shipping</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="Seller">Seller</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="SimilarProducts">Similar Products</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="Product">
                        <Product item={item}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Photos">
                        <Photos item={item} similarPhotos={similarPhotos}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Shipping">
                        <Shipping items={items} item={item}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Seller">
                        <Seller item={item}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="SimilarProducts">
                        <SimilarProducts similarProducts={similarProducts} item={item}/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    </div>
  );
};

const mapStateToProps = state => ({
    items: items(state),
    item: details(state),
    isDetailPageOpen: isDetailPageOpen(state),
    isClear: isClear(state),
    isLoading: isLoading(state),
    similarPhotos: similarPhotos(state),
    similarProducts: similarProducts(state),
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ItemDetails);