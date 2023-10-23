import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Col, Row, Tabs, Tab, Container } from 'react-bootstrap';
import { fetchItems } from '../Api';
import styles from './styles.module.css';
import { useState } from 'react';
import ItemsList from '../ItemsList';
import Wishlist from '../ItemsList/Wishlist';
import { currentLocation, setClear } from '../features/resultsSlice';
import './tabStyles.css'
import { setDetailPageOpen } from '../features/itemDetailSlice';


function ProductSearch(props) {
    const {currentLocation, setClear, setDetailPageOpen} = props;
    const [keywords, setKeywords] = useState('');
    const [category, setCategory] = useState('0');
    const [conditionNew, setConditionNew] = useState(false);
    const [conditionUsed, setConditionUsed] = useState(false);
    const [localPickup, setLocalPickup] = useState(false);
    const [freeShipping, setFreeShipping] = useState(false);
    const [distance, setDistance] = useState(10);
    const [fromWhere, setFromWhere] = useState('current');
    const [zip, setZip] = useState('');


    function resetForm () {
        setKeywords('');
        setCategory('0');
        setConditionNew(false);
        setConditionUsed(false);
        setLocalPickup(false);
        setFreeShipping(false);
        setDistance(10);
        setFromWhere('current');
        setZip('');
    }

    function MyButtons() {
        function OnSubmitClick() {
            let postalZip = currentLocation;
            if (fromWhere !== 'current') {
                postalZip = zip;
            }
            fetchItems(keywords, postalZip, distance, category, freeShipping, localPickup, conditionNew, conditionUsed);
        }

        function OnClearClick() {
            setClear(true);
            resetForm();
        }

        return (
            <div className={styles.buttonsContainer}>
            <Button disabled={!isSubmitEnabled()} onClick={OnSubmitClick} className={`${styles.actionButtons} btn-spacing mr-5 btn-light btm-sm text-dark`}>
                <i className="material-icons-outlined buttonImg">search</i>Search
            </Button>
            
            <Button onClick={OnClearClick} className={`${styles.actionButtons} mr-5 btn-light btm-sm text-dark`}>
                <i className="material-icons-outlined buttonImg">clear_all</i>Clear
            </Button>
            </div>
        );
    }

    function isKeyWordsValid() {
        if (keywords && keywords.trim() !== '') {
            return true
        }
        return false
    }

    function isZipValid() {
        if (zip && zip.trim() !== '' && /^\d{5}$/.test(zip)) {
            return true
        }
        return false
    }

    function isSubmitEnabled() {
        return isKeyWordsValid() && (fromWhere === 'current' || isZipValid());
    }

    function KeywordsField() {
        const keywordChange = (e) => {
            setKeywords(e.target.value);
        }

        return (
            <Row className='mb-3'>
                <Form.Label column sm={3}>Keyword*</Form.Label>
                <Col sm={8}>
                <Form.Control onChange={keywordChange} value={keywords} type="text" placeholder="Enter Product Name (e.g. iPhone 8)" />
                </Col>
            </Row>
        )
    }

    function CategoryDroddowns() {
        const categoryChange = (e) => {
            setCategory(e.target.value);
        }

        return (
            <Row className='mb-3'>
                <Form.Label column sm={3}>Category</Form.Label>
                <Col sm={3}>
                <Form.Control as="select" value={category} onChange={categoryChange}>
                    <option value="0">All Categories</option>
                    <option value="550">Art</option>
                    <option value="2984">Baby</option>
                    <option value="267">Books</option>
                    <option value="11450">Clothing, Shoes & Accesories</option>
                    <option value="58058">Computers/Tablets & Networking</option>
                    <option value="26395">Health & Beauty</option>
                    <option value="11233">Music</option>
                    <option value="1249">Video Games and Console</option>
                </Form.Control>
                </Col>
            </Row>
        )
    }

    function Condition() {
        const conditionNewChange = (e) => {
            setConditionNew(e.target.checked);
        }

        const conditionUsedChange = (e) => {
            setConditionUsed(e.target.checked);
        }

        return (
            <Row className='mb-3'>
                <Form.Label column sm={3}>Condition</Form.Label>
                <Col sm={8}>
                    <div className={styles.conditions}>
                        <Form.Check onChange={conditionNewChange} checked={conditionNew} type="checkbox" label="New" id="conditionNew" />
                        <Form.Check onChange={conditionUsedChange} checked={conditionUsed} type="checkbox" label="Used" id="conditionUsed" />
                        <Form.Check type="checkbox" label="Unspecified" id="conditionUnspecified" />
                    </div>
                </Col>
            </Row>
        )
    }

    function ShippingOptions() {
        const freeShippingChange = (e) => {
            setFreeShipping(e.target.checked);
        }

        const localPickupChange = (e) => {
            setLocalPickup(e.target.checked);
        }
        
        return (
            <Row className='mb-3'>
                <Form.Label column sm={3}>Shipping Options</Form.Label>
                <Col sm={8}>
                    <div className={styles.conditions}>
                        <Form.Check checked={localPickup} onChange={localPickupChange} type="checkbox" label="Local Pickup"  id="shippingLocal" />
                        <Form.Check checked={freeShipping} onChange={freeShippingChange} type="checkbox" label="Free Shipping" id="shippingFree" />
                    </div>
                </Col>
            </Row>
        )
    }

    function Distance() {
        const distanceChange = (e) => {
            setDistance(e.target.value);
        }
        
        return (
            <Row className='mb-3'>
                <Form.Label column sm={3}>Distance (Miles)</Form.Label>
                <Col sm={8}>
                    <Form.Control type="number" value={distance} onChange={distanceChange}/>
                </Col>
            </Row>
        )
    }

    function Location() {
        const fromWhereChange = (e) => {
            setFromWhere(e.target.value);
        }

        const zipChange = (e) => {
            setZip(e.target.value);
        }
        
        return (
            <Row className='mb-3'>
                <Form.Label column sm={3}>From*</Form.Label>
                <Col sm={8}>
                    <Form.Check onChange={fromWhereChange} checked={fromWhere === 'current'} value='current' type="radio" label="'Current Location'" name="location" id="locationCurrent" />
                    <Form.Check onChange={fromWhereChange} checked={fromWhere !== 'current'} value='other' className="col-sm-5" type="radio" label="Other. Please specify zip code:" name="location" id="locationOther" />
                    <Form.Control type="text" disabled={fromWhere==='current'} onChange={zipChange}/>
                </Col>
            </Row>
        )
    }

    function closeDetailPage() {
        setDetailPageOpen(false);
    }

    return (
        <div className={styles.topContainer}>
            <div className={styles.productSearch}>
                <Container className={styles.container}>
                    <h2>Product Search</h2>
                    <Form>
                        {KeywordsField()}
                        {CategoryDroddowns()}
                        {Condition()}
                        {ShippingOptions()}
                        {Distance()}
                        {Location()}
                        {MyButtons()}
                    </Form>
                </Container>
            </div>

            <div className={styles.tabsSection}>
            <Tabs className="m-4">
                <Tab onClick={closeDetailPage} eventKey="results" title="Results">
                <ItemsList/>
                </Tab>
                <Tab onClick={closeDetailPage} eventKey="wishlist" title="Wish List">
                <Wishlist/>
                </Tab>
            </Tabs>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    currentLocation: currentLocation(state),
});
  
const mapDispatchToProps = dispatch => ({
    setClear: (clearState) => dispatch(setClear(clearState)),
    setDetailPageOpen: (open) => dispatch(setDetailPageOpen(open)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductSearch);
