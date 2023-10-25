import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import './photosStyles.css';
const _ = require('lodash');

const Photos = (props) => {
  const {similarPhotos} = props;
  let photosLinks = _.get(similarPhotos, "items", [])
  photosLinks = _.map(photosLinks, (itm, idx) => _.get(itm, 'link', ''));

  const getImage = (idx) => {
    return (
        <a href={photosLinks[idx]} target='_blank' rel="noreferrer">
            <img src={photosLinks[idx]} className="img-fluid mb-2" alt="similar pic"/>
        </a>
    )
  }

  return (
    <Container className='photosContainer'>
        <Row className='p-0'>
            <Col sm={4}>
                {getImage(0)}
                {getImage(1)}
            </Col>
            <Col sm={4}>
                {getImage(2)}
                {getImage(3)}
                {getImage(4)}
            </Col>
            <Col sm={4}>
                {getImage(5)}
                {getImage(6)}
                {getImage(7)}
            </Col>
        </Row>
    </Container>
  )
};

const mapStateToProps = state => ({
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Photos);