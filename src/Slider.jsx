import React, { useState } from 'react';

function Slider({ name, min, max, step, featureKey, featureFn, feature }) {
    const value = feature[featureKey];

    const handleChange = (event) => {
        let newValue = Number(event.target.value);

        // Clamp value between min and max
        if (newValue < min) {
            newValue = min;
        } else if (newValue > max) {
            newValue = max;
        }

        // Use computed property name to update the correct key
        featureFn({
            ...feature,
            [featureKey]: newValue
        });
    };

    return (
        <div>
            <div className="slidecontainer">
                <label htmlFor={`${featureKey}-slider`}>{name}</label>
                <input
                    type="range"
                    id={`${featureKey}-slider`}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    className="slider"
                    onChange={handleChange}
                />
            </div>
            <div className="input-container">
                <label htmlFor={`${featureKey}-number`}>Value:</label>
                <input
                    type="number"
                    id={`${featureKey}-number`}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default Slider;
