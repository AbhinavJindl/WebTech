import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './rowsStyles.css';
import CircularProgressBar from './circularProgress';
const _ = require('lodash');

const Seller = (props) => {
  const {item} = props;

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

  const feedbackScore = () => {
    let score = _.get(item, ["Seller", "FeedbackScore"], null)
    if (score === null) {
        return null
    }

    return (
        <Row className='p-2'>
            <Col className='table-key' sm={4}>Feedback Score</Col>
            <Col sm={8}>{score}</Col>
        </Row>
    )
  }

  const popularity = () => {
    let pop = _.get(item, ["Seller", "PositiveFeedbackPercent"], null)
    if (pop === null) {
        return null
    }
    return (
        <>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Popularity</Col>
                <Col sm={8}><CircularProgressBar percentage={pop}/></Col>
            </Row>
        </>
    )
  }

  const feedbackRatingStar = () => {
    let rate = _.get(item, ["Seller", "FeedbackRatingStar"], null)
    if (rate === null) {
        return null
    }

    let score = _.get(item, ["Seller", "FeedbackScore"], null)
    if (score === null) {
        return null
    }

    const spaceIndex = _.upperCase(rate).indexOf(' ');
    let color;
    if (spaceIndex !== -1) {
        color = rate.substr(0, spaceIndex);
    } else {
        color = rate;
    }
    
    const iconName = parseInt(score) >= 10000 ? 'stars' : 'star_border';

    return (
        <>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Feedback Rating Star</Col>
                <Col sm={8}>
                <span className="material-icons" style={{ color, borderRadius: '50%', padding: '3px'}}>{iconName}</span>
                </Col>
            </Row>
        </>
    )
  }

  const topRated = () => {
    let top = _.get(item, ["Seller", "TopRatedSeller"], null)

    if (top === null) {
        return null
    }

    let mark = '';
    if (top) {
        mark = getTick();
    } else {
        mark = getCross();
    }

    return (
        <>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Top Rated</Col>
                <Col sm={8}>{mark}</Col>
            </Row>
        </>
    )
  }


  const storeName = () => {
    let name = _.get(item, ["Storefront", "StoreName"], null)

    if (name === null) {
        return null
    }

    return (
        <>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Store Name</Col>
                <Col sm={8}>{name}</Col>
            </Row>
        </>
    )
  }

  const storeNameHeader = () => {
    let name = _.get(item, ["Storefront", "StoreName"], null)

    if (name === null) {
        return null
    }

    return (
        <>
            <Row className='p-4 justify-content-center align-items-center' style={{"text-align": "center"}}>
                <Col sm={12}>{name.toUpperCase()}</Col>
            </Row>
        </>
    )
  }

  const storeLink = () => {
    let link = _.get(item, ["Storefront", "StoreURL"], null)

    if (link === null) {
        return null
    }

    return (
        <>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Buy Product At</Col>
                <Col sm={8}><a href={link} style={{color: "teal"}} target='_blank' rel="noreferrer">Store</a></Col>
            </Row>
        </>
    )
  }

  return (
    <Container className="row-container">
        {storeNameHeader()}
        {feedbackScore()}
        {popularity()}
        {feedbackRatingStar()}
        {topRated()}
        {storeName()}
        {storeLink()}
    </Container>
  )
};
  
export default Seller;