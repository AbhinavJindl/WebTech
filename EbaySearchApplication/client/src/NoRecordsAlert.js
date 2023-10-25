import './App.css';
import React from 'react';
import { Alert } from 'react-bootstrap';

function NoRecordsAlert(props) {
    return (
        <Alert key={'warning'} variant={'warning'}>
            No Records.
        </Alert>
    );
}

export default NoRecordsAlert;