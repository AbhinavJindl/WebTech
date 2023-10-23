import React, {useState} from 'react';
import { Form, Button, Col, Row, Tabs, Tab, Container } from 'react-bootstrap';
import styles from './styles.module.css';

function RequiredText() {
    const [text, setText] = useState('');
    const [error, setError] = useState(false);
    return (
        <>
        <Form.Control
            type="text"
            value={text} 
            onChange={(e) => setText(e.target.value)}
            isInvalid={keywordError} 
            placeholder="Enter Product Name (e.g. iPhone 8)" 
        />
        <Form.Control.Feedback type="invalid">Please enter a keyword.</Form.Control.Feedback>
        </>
    )
}

export default RequiredText;
