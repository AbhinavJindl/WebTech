import React, {useEffect, useState} from 'react';
import { Card, Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import './rowsStyles.css';
import NoRecordsAlert from '../NoRecordsAlert';
const _ = require('lodash');

const getItems = (similarProducts) => {
    const getDaysLeft = (text) => {
        let days = null;
        const match = text.match(/P(.*?)D/);
        if (match) {
            days = match[1];
        }
        return days
    }

    return _.map(similarProducts, (product, idx) => {
        return {
            'title': _.get(product, 'title', null),
            'url': _.get(product, 'viewItemURL', null),
            'price': _.get(product, ['buyItNowPrice', '__value__'], null),
            'shipping': _.get(product, ['shippingCost', '__value__'], null),
            'days': getDaysLeft(_.get(product, 'timeLeft', null)),
            'image': _.get(product, 'imageURL', null),
        }
    })
}


const SimilarProducts = (props) => {
    const {similarProducts} = props;

    const [currentProductsList, setProductsList] = useState(similarProducts);
    const [sortKey, setSortKey] = useState('default');
    const [sortOrder, setSortOrder] = useState('ascending');
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        setProductsList(getItems(similarProducts));
    }, [similarProducts]);

    if (similarProducts.length === 0){
        return <NoRecordsAlert/>
    }

    const getShowMoreButton =  () => {
        if (similarProducts.length < 5) {
            return null
        }
        let text = "Show More";
        let f = () => {setShowMore(true)}
        if (showMore) {
            text = "Show Less";
            f = () => {setShowMore(false)}
        }
        return (
            <Row className="justify-content-center">
                <Button variant="dark" className="text-white" style={{ width: '130px' }} onClick={f}>{text}</Button>
            </Row>
        )

    }

    const handleSort = (key, order) => {
        if (key === 'default') {
            order = 'ascending';
        }
        let sortedProducts = [...getItems(similarProducts)];
        switch(key) {
            case 'default':
                break;
            case 'productName':
                sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'daysLeft':
                sortedProducts.sort((a, b) => a.days - b.days);
                break;
            case 'price':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'shippingCost':
                sortedProducts.sort((a, b) => a.shipping - b.shipping);
                break;
            default:
                break;
        }

        if (key !== 'default') {
            if (order !== "ascending") {
                sortedProducts.reverse();
            }
        }

        setSortKey(key);
        setSortOrder(order);
        setProductsList(sortedProducts);
    };

    const sortKeyToText = {
        "default": "Default",
        "productName": "Product Name",
        "daysLeft": "Days Left",
        "price": "Price",
        "shippingCost": "Shipping Cost",
    }

    const sortOrderToText = {
        "ascending": "Ascending",
        "descending": "Descending",
    }

    // "disable dropdown in react bootstrap" (1 line). ChatGPT, 25 Sep. version, OpenAI, 20 Oct. 2023, chat.openai.com/chat.

    return (
        <Container>
            <Row className='mb-3'>
                <Col sm="3">
                <Dropdown className='mr-2'>
                    <Dropdown.Toggle variant="light" className="dropdown-sort-field w-100">
                        {sortKeyToText[sortKey]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='w-100'>
                        {_.map(
                            Object.keys(sortKeyToText),
                            (o, idx) => (<Dropdown.Item onClick={() => handleSort(o, sortOrder)}>{sortKeyToText[o]}</Dropdown.Item>)
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                </Col>
                <Col sm="3">
                <Dropdown>
                    <Dropdown.Toggle variant="light" className="dropdown-sort-field w-100" disabled={sortKey === 'default'}>
                        {sortOrderToText[sortOrder]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='w-100'>
                        {_.map(
                            Object.keys(sortOrderToText),
                            (o, idx) => (<Dropdown.Item onClick={() => handleSort(sortKey, o)}>{sortOrderToText[o]}</Dropdown.Item>)
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                </Col>
            </Row>
          {currentProductsList.map((product, index) => {
            if (showMore || index < 5) {
                return (
                    <Card className="mb-4 bg-dark" key={index}>
                    <Row noGutters>
                        <Col sm={3} xs={6}>
                            <Card.Img className='m-2' variant="top" src={product.image} style={{"height": "150px"}}/>
                        </Col>
                        <Col sm={9}>
                        <Card.Body>
                            <a style={{"text-decoration": "None"}} href={product.url} target='_blank' rel="noreferrer">
                                <Card.Text className='m-0' style={{"color": "#557372"}}>{product.title}</Card.Text>
                            </a>
                            <Card.Text className='m-0' style={{"color": "#86A680"}}>
                                Price: {product.price}
                            </Card.Text>
                            <Card.Text className='m-0' style={{"color": "#948039"}}>
                                Shipping Cost: {product.shipping}
                            </Card.Text>
                            <Card.Text className='m-0' style={{"color": "white"}}>
                                Days Left: {product.days}
                            </Card.Text>
                        </Card.Body>
                        </Col>
                    </Row>
                    </Card>
                )
            } else {
                return (<></>)
            }
        })}
        {getShowMoreButton()}
        </Container>
      );
};
  
export default SimilarProducts;