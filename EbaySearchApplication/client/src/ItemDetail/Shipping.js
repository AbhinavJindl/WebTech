import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import './rowsStyles.css';
const _ = require('lodash');

const Shipping = (props) => {
  const {item, items} = props;

  const getItemFromList = () => {
    return _.find(items, {'itemId': item.ItemID});
  }

  const getCurrentItemShippingInfo = () => {
    const foundItem = getItemFromList();
    if (!foundItem) {
        throw Error("Item not found in all items list");
    }
    return _.get(foundItem, ['shippingInfo', 0], {})
  }

  const getTick = () => {
    return (
        <i className="material-icons-outlined text-success">done</i>
    )
  }

  const getCross = () => {
    return (
        <i className="material-icons-outlined text-danger">close</i>
    )
  }

  const shippingCost = () => {
    let cost = _.get(getCurrentItemShippingInfo(), ["shippingServiceCost", 0, "__value__"], null)
    if (!cost) {
        return null
    }
    if (cost === "0.0") {
        cost = "Free Shipping"
    } else {
        cost = `$${cost}`
    }
    return (
        <Row className='p-2'>
            <Col className='table-key' sm={4}>Shipping Cost</Col>
            <Col sm={8}>{cost}</Col>
        </Row>
    )
  }

  const shippingLocations = () => {
    let loc = _.get(getCurrentItemShippingInfo(), ["shipToLocations", 0], null)
    if (!loc) {
        return null
    }
    return (
        <>
            <Row className='margin-row'>
            </Row>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Shipping Locations</Col>
                <Col sm={8}>{loc}</Col>
            </Row>
        </>
    )
  }

  const handlingTime = () => {
    let time = _.get(getCurrentItemShippingInfo(), ["handlingTime", 0], null)
    if (!time) {
        return null
    }

    let handlingTime = '';
    if (time > 1) {
        handlingTime = `${time} Days`
    } else {
        handlingTime = `${time} Day`
    }
    return (
        <>
            <Row className='margin-row'>
            </Row>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Handling Time</Col>
                <Col sm={8}>{handlingTime}</Col>
            </Row>
        </>
    )
  }

  const expeditedShipping = () => {
    let expedited = _.get(getCurrentItemShippingInfo(), ["expeditedShipping", 0], null)
    if (!expedited) {
        return null
    }

    let mark;
    if (expedited ===  "true") {
        mark = getTick();
    } else {
        mark = getCross();
    }
    return (
        <>
            <Row className='margin-row'>
            </Row>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Expedited Shipping</Col>
                <Col sm={8}>{mark}</Col>
            </Row>
        </>
    )
  }

  const oneDayShipping = () => {
    let oneDay = _.get(getCurrentItemShippingInfo(), ["oneDayShippingAvailable", 0], null)
    if (!oneDay) {
        return null
    }

    let mark;
    if (oneDay ===  "true") {
        mark = getTick();
    } else {
        mark = getCross();
    }
    return (
        <>
            <Row className='margin-row'>
            </Row>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>One Day Shipping</Col>
                <Col sm={8}>{mark}</Col>
            </Row>
        </>
    )
  }

  const returnAccepted = () => {
    const foundItem = getItemFromList();
    let ret = _.get(foundItem, ["returnsAccepted", 0], null)
    if (!ret) {
        return null
    }

    let mark;
    if (ret ===  "true") {
        mark = getTick();
    } else {
        mark = getCross();
    }
    return (
        <>
            <Row className='margin-row'>
            </Row>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Return Accepted</Col>
                <Col sm={8}>{mark}</Col>
            </Row>
        </>
    )
  }

  return (
    <Container className="row-container">
        {shippingCost()}
        {shippingLocations()}
        {handlingTime()}
        {expeditedShipping()}
        {oneDayShipping()}
        {returnAccepted()}
    </Container>
  )
};

const mapStateToProps = state => ({
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Shipping);