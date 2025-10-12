import React from 'react';
import logo from '../assets/Generated Image October 06, 2025 - 5_46PM.png'; // Adjust path based on your folder

function Header() {
    return (
        <header>
            <img src={logo} alt="Logo" />
            <h2>THRIVE (Tactical HeatRisk Vulnerability Explorer)</h2>
        </header>
    );
}

export default Header;
