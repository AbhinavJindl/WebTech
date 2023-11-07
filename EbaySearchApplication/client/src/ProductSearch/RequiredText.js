import React, {useEffect, useState} from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import './requiredTextStyles.css';

function RequiredText(props) {
    const {validator, value, onValueChange, errorMessage, placeholderText, disabled, suggestions, showError, changeShowError} = props
    const [error, setError] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);

    useEffect(() => {
        if (disabled || !showError) {
            setError(false);
            if (validator(value)) {
                setError(false);
            }
        } else {
            if (!validator(value)) {
                setError(true)
            } else {
                setError(false);
            }
        }
    }, [disabled, value, validator, showError]);

    const checkAndSetError = (val) => {
        if (!validator(val)) {
            setError(true);
        } else {
            setError(false);
        }
    }

    const onBlur = (e) => {
        changeShowError()
    }

    const onValChange = (val) => {
        onValueChange(val);
        checkAndSetError(val);
    }

    const onChange = (e) => {
        onValChange(e.target.value);
        setShowSuggestions(true);
    }

    const onSuggestClick = (item) => (e) => {
        onValChange(item);
        setShowSuggestions(false);
    }

    const AutoSuggestComponent = () => {
        if (error || !suggestions || suggestions.length === 0 || !showSuggestions) {
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
                onBlur={onBlur}
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
