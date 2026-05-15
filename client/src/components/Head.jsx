import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaTachometerAlt, FaGamepad, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/websitelogo.png";

const Head = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="header-logo-wrapper">
        <Link to="/" aria-label="Go to homepage" className="logo-link" onClick={closeMobileMenu}>
          <img src={logo} alt="CodeVibe Logo" title="CodeVibe - Learn. Practice. Master." />
        </Link>
      </div>
      
      <button 
        className="hamburger-btn" 
        onClick={toggleMenu} 
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`header-nav ${menuOpen ? "open" : ""}`}>
        <Link to="/Login" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaSignInAlt className="nav-icon" />
          <span>Login</span>
        </Link>

        <Link to="/Signup" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaUserPlus className="nav-icon" />
          <span>Sign Up</span>
        </Link>

        <Link to="/Dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
          <FaTachometerAlt className="nav-icon" />
          <span>Dashboard</span>
        </Link>
      </div>

      <h1>
        <FaGamepad style={{ marginRight: '0.5rem' }} />
        CodeVibe
        <FaGamepad style={{ marginLeft: '0.5rem' }} />
      </h1>
      <p>Learn • Practice • Master • Code | Level Up Your Programming Skills</p>
    </header>
  );
}

export default Head;
