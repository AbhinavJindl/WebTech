import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressBar = (props) => {
    const {percentage} = props;

    return (
        <div style={{ width: "2.5em", height: "2.5em" }}>
            <CircularProgressbar
                value={percentage}
                text={percentage}
                styles={buildStyles({
                    pathColor: 'green',
                    textColor: 'white',
                    trailColor: 'white',
                    textSize: '2em',
                })}
            />
        </div>
    );
}

export default CircularProgressBar;
