import React from 'react';
import logo from '../assets/Generated Image October 06, 2025 - 5_46PM.png'; // Adjust path based on your folder

function Header({ msg }) {
    return (
        <header>
            <div className="header-content">
                <div className="header-center">
                    <img src={logo} alt="Logo" className="header-logo" />
                    <div className="header-text">
                        <h1 className="header-title">THRIVE</h1>
                        <p className="header-subtitle">Tactical HeatRisk Vulnerability Explorer</p>
                    </div>
                </div>
                {msg && (
                    <div className={`message ${msg.color}`}>
                        <span>{msg.text}</span>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
