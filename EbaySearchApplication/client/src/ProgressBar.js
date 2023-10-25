import { ProgressBar } from "react-bootstrap";
import React from 'react';

function ProgressBarComponent() {
    console.log("here");
    return (
        <ProgressBar animated now={50} />
    );
}

export default ProgressBarComponent;