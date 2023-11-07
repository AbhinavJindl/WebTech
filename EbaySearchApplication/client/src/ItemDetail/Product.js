import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Modal, Button , Carousel} from 'react-bootstrap';
import './rowsStyles.css';
const _ = require('lodash');

const Product = (props) => {
  const {item} = props;

  const [showImages, setShowImages] = useState(false);
  const handleCloseImages = () => {
    setShowImages(false);
  }
  const handleShowImages = () => {
    setShowImages(true);
  }

  const imagesModal = () => {
    const imagesUrls = _.get(item, 'PictureURL', [])

    return (
        <Modal show={showImages} onHide={handleCloseImages} size="sm">
            <Modal.Header closeButton>
                <Modal.Title style={{"font-size": "14px"}}>Product Images</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Carousel 
            interval={null} 
            indicators={false} 
            nextIcon={<span aria-hidden="true" className="prevNextImageButton carousel-control-next-icon bg-dark"/>} 
            prevIcon={<span aria-hidden="true" className="prevNextImageButton carousel-control-prev-icon bg-dark"/>}
            >
                {imagesUrls.map((img, index) => (
                    <Carousel.Item key={index}>
                    <img src={img} alt="Product" className="img-fluid d-block" style={{height: "300px", "width": "100%"}} />
                    </Carousel.Item>
                ))}
            </Carousel>
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
            <Col sm={8}><span onClick={handleShowImages} style={{color: "teal"}}>View Product Images Here</span></Col>
        </Row>

        {imagesModal()}

        {getPrice()}

        {getLocation()}

        {getReturnPolicy()}

        {get_item_specifics().map((nameValue, index) => (
            <Row className='p-2' index={index}>
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