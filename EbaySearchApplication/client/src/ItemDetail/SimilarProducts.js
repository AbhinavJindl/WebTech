import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './rowsStyles.css';
import CircularProgressBar from './circularProgress';
import NoRecordsAlert from '../NoRecordsAlert';
const _ = require('lodash');

const SimilarProducts = (props) => {
  const {item, similarProducts} = props;

  if (similarProducts.length === 0){
    return <NoRecordsAlert/>
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

  const feedbackScore = () => {
    let score = _.get(item, ["Seller", "FeedbackScore"], null)
    if (!score) {
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
    if (!pop) {
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
    if (!rate) {
        return null
    }

    return (
        <>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Feedback Rating Star</Col>
                <Col sm={8}>{rate}</Col>
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

    if (!name) {
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

  const storeLink = () => {
    let link = _.get(item, ["Storefront", "StoreURL"], null)

    if (!link) {
        return null
    }

    return (
        <>
            <Row className='p-2'>
                <Col className='table-key' sm={4}>Buy Product At</Col>
                <Col sm={8}><a href={link} target='_blank' rel="noreferrer">Store</a></Col>
            </Row>
        </>
    )
  }

  return (
    <Container className="row-container">
        {feedbackScore()}
        {popularity()}
        {feedbackRatingStar()}
        {topRated()}
        {storeName()}
        {storeLink()}
    </Container>
  )
};
  
export default SimilarProducts;