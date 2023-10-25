import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import './rowsStyles.css';
const _ = require('lodash');

const Product = (props) => {
  const {item} = props;

  const [showImages, setShowImages] = useState(false);
  const [imageNumber, setImageNumber] = useState(0);
  const handleCloseImages = () => {
    setImageNumber(0);
    setShowImages(false);
  }
  const handleShowImages = () => {
    setImageNumber(0);
    setShowImages(true);
  }

  const imagesModal = () => {
    const imagesUrls = _.get(item, 'PictureURL', [])
    function nextImagePresent() {
        return imageNumber < imagesUrls.length-1;
    }
    function prevImagePresent() {
        return imageNumber > 0;
    }
    function changeNextImage() {
        if (!nextImagePresent()) {
            return
        }
        setImageNumber(imageNumber + 1);
    }
    function changePrevImage() {
        if (!prevImagePresent()) {
            return
        }
        setImageNumber(imageNumber - 1);
    }

    return (
        <Modal show={showImages} onHide={handleCloseImages} centered size="sm">
            <Modal.Body>
            <Row>
                <Col xs={1} className="text-center">
                    <Button variant="link" disabled={!prevImagePresent()} onClick={changePrevImage}>&lt;</Button>
                </Col>
                <Col xs={10}>
                    <img src={imagesUrls[imageNumber]} alt="Product" className="img-fluid" />
                </Col>
                <Col xs={1} className="text-center">
                    <Button variant="link" onClick={changeNextImage} disabled={!nextImagePresent()}>&gt;</Button>
                </Col>
            </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseImages}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    )
  }

  const get_item_specifics = () => {
    return _.get(item, ["ItemSpecifics", "NameValueList"], [])
  }

  const getPrice = () => {
    const price = _.get(item, ['CurrentPrice', 'Value'])

    if (!price) {
        return null
    }

    return (
        <Row className='p-2'>
            <Col className='table-key' sm={4}>Price</Col>
            <Col sm={8}>{`$${price}`}</Col>
        </Row>
    )
  }

  const getLocation = () => {
    const loc = _.get(item, 'Location')

    if (!loc) {
        return null
    }

    return (
        <Row className='p-2'>
            <Col className='table-key' sm={4}>Location</Col>
            <Col sm={8}>{loc}</Col>
        </Row>
    )
  }

  const getReturnPolicy = () => {
    let returnPolicyText = ''
    const returnsAcceptedText = _.get(item, ['ReturnPolicy', 'ReturnsAccepted']);
    if (returnsAcceptedText) {
        returnPolicyText = returnPolicyText + returnsAcceptedText + ' '
    }
    const returnsWithinText = _.get(item, ['ReturnPolicy', 'ReturnsWithin']);
    if (returnsWithinText) {
        returnPolicyText = returnPolicyText + `within ${returnsWithinText}`
    }

    if (returnPolicyText === '') {
        return null
    }

    return (
        <Row className='p-2'>
            <Col className='table-key' sm={4}>Return Policy</Col>
            <Col sm={8}>{returnPolicyText}</Col>
        </Row>
    )
  }

  return (
    <Container className="row-container">
        <Row className='p-2'>
            <Col className='table-key' sm={4}>Product Images</Col>
            <Col sm={8}><span onClick={handleShowImages}>View Product Images Here</span></Col>
        </Row>

        {imagesModal()}

        {getPrice()}

        {getLocation()}

        {getReturnPolicy()}

        {get_item_specifics().map((nameValue, index) => (
            <Row className='p-2'>
                <Col className='table-key' sm={4}>{_.get(nameValue, 'Name')}</Col>
                <Col sm={8}>{_.get(nameValue, ['Value', 0])}</Col>
            </Row>
          ))}
    </Container>
  )
};

const mapStateToProps = state => ({
});
  
const mapDispatchToProps = dispatch => ({
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Product);