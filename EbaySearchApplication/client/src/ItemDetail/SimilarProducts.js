import React, {useEffect, useState} from 'react';
import { Card, Container, Row, Col, Dropdown } from 'react-bootstrap';
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

    useEffect(() => {
        setProductsList(getItems(similarProducts));
    }, [similarProducts]);

    if (similarProducts.length === 0){
        return <NoRecordsAlert/>
    }

    const handleSort = (key, order) => {
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

    return (
        <Container>
            <Row>
                <Col sm={3}>
                    <select value="default">
                        <option value="default">Default</option>
                        <option value="default">Default</option>
                        <option value="default">Default</option>
                    </select>
                    <Dropdown data-bs-theme="light">
                        <Dropdown.Toggle>
                            Key
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSort('default', sortOrder)}>Default</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSort('productName', sortOrder)}>Product Name</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSort('daysLeft', sortOrder)}>Days Left</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSort('price', sortOrder)}>Price</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSort('shippingCost', sortOrder)}>Shipping Cost</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col sm={3}>
                    <Dropdown>
                        <Dropdown.Toggle>
                            Order
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSort(sortKey, 'ascending')}>Ascending</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSort(sortKey, 'descending')}>Descending</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                
            </Row>
          {currentProductsList.map((product, index) => (
            <Card className="mb-4" key={index}>
              <Row noGutters>
                <Col sm={3}>
                  <Card.Img variant="top" src={product.image} />
                </Col>
                <Col sm={9}>
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>
                      Price: {product.price}
                    </Card.Text>
                    <Card.Text>
                      Shipping Cost: {product.shipping}
                    </Card.Text>
                    <Card.Text>
                      Days Left: {product.days}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </Container>
      );
};
  
export default SimilarProducts;