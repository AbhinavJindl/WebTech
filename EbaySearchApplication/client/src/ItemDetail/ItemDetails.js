import React, {useEffect} from 'react';
import styles from './styles.module.css'
import { connect } from 'react-redux';
import { items, isClear, isLoading, wishlistItems } from '../features/resultsSlice';
import { details, isDetailPageOpen, setDetailPageOpen, similarPhotos, similarProducts } from '../features/itemDetailSlice';
import Product from './Product';
import { Tab, Nav, Container, Row, Button } from 'react-bootstrap';
import ProgressBarComponent from '../ProgressBar';
import Photos from './Photos';
import Shipping from './Shipping';
import Seller from './Seller';
import SimilarProducts from './SimilarProducts';
import CartIcon from '../ItemsList/cartIcon';
import './rowsStyles.css';
const _ = require('lodash')

const ItemDetails = (props) => {
  const {similarProducts, isClear, items, item, isDetailPageOpen, setDetailPageOpen, isLoading, similarPhotos, wishlistItems} = props;

  useEffect(() => {
    window.fbAsyncInit = function() {
        window.FB.init({
            appId      : '629226582481731',
            xfbml      : true,
            version    : 'v12.0'
        });
        
        window.FB.AppEvents.logPageView();
    };
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
  }, []);

  if (!isDetailPageOpen) {
    return null
  }

  if (isLoading) {
    return <ProgressBarComponent/>
  }

  const shareOnFacebook = () => {
        window.FB.ui({
            method: 'share',
            href: item.ViewItemURLForNaturalSearch,
            quote: `Buy ${item.Title} at ${_.get(item, ['BuyItNowPrice', 'Value'], null)} from ${item.ViewItemURLForNaturalSearch} below.`,
        },
        function(response) {
            // if (response && !response.error_message) {
            //     alert('Successfully shared!');
            // } else {
            //     alert('Error while sharing!');
            // }
        });
    }



  return (
    <div className={styles.tableContainer}>
        <div className={styles.detailHeader}>
            <Container>
                <Row style={{"text-align": "center"}}><h5>{item.Title}</h5></Row>
                <div className={styles.headerRow}>
                    <Button style={{"width": "5em"}} onClick={() => setDetailPageOpen(false)} className={`btn-spacing mr-5 btn-light btm-sm text-dark`}>
                        {"< List"}
                    </Button>
                    <div className={styles.rightHeaders}>
                        <img src={require("./facebook.png")} alt="Facebook" onClick={shareOnFacebook} className={styles.facebookIcon}/>
                        <CartIcon productId={item.ItemID}/>
                    </div>
                </div>
            </Container>
        </div>
      <div className={styles.tabsSection}>
            <Tab.Container defaultActiveKey="Product">
                <Nav variant="tabs" style={{"justify-content": "flex-end"}}>
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
                        <Shipping items={items} item={item} wishlistItems={wishlistItems}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Seller">
                        <Seller item={item}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="SimilarProducts">
                        <SimilarProducts similarProducts={similarProducts}/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    </div>
  );
};

const mapStateToProps = state => ({
    items: items(state),
    wishlistItems: wishlistItems(state),
    item: details(state),
    isDetailPageOpen: isDetailPageOpen(state),
    isClear: isClear(state),
    isLoading: isLoading(state),
    similarPhotos: similarPhotos(state),
    similarProducts: similarProducts(state),
});
  
const mapDispatchToProps = dispatch => ({
    setDetailPageOpen : (open) => dispatch(setDetailPageOpen(open)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ItemDetails);