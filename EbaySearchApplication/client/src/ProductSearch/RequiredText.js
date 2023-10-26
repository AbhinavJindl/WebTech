import React, {useEffect, useState} from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import './requiredTextStyles.css';

function RequiredText(props) {
    const {validator, value, onValueChange, errorMessage, placeholderText, disabled, suggestions} = props
    const [error, setError] = useState(false);

    useEffect(() => {
        if (disabled) {
            setError(false);
        } else {
            if (!validator(value)) {
                setError(true)
            }
        }
    }, [disabled, value, validator]);

    const checkAndSetError = (val) => {
        if (!validator(val)) {
            setError(true);
        } else {
            setError(false);
        }
    }

    const onFocus = (e) => {
        checkAndSetError(e.target.value)
    }

    const onValChange = (val) => {
        onValueChange(val);
        checkAndSetError(val);
    }

    const onChange = (e) => {
        onValChange(e.target.value);
    }

    const onSuggestClick = (item) => (e) => {
        onValChange(item);
    }

    const AutoSuggestComponent = () => {
        if (error || !suggestions || suggestions.length === 0) {
            return null
        }
        return (
            <ListGroup>
                {suggestions.map((item, idx) => (
                    <ListGroup.Item onClick={onSuggestClick(item)} key={idx}>
                        {item}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        )
    }

    return (
        <>
            <Form.Control
                type="text"
                value={value} 
                onChange={onChange}
                onFocus={onFocus}
                isInvalid={error} 
                placeholder={placeholderText} 
                disabled={disabled}
            />
            <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
            {AutoSuggestComponent()}
        </>
    )
}

export default RequiredText;
