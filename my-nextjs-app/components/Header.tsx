import React from "react";

const Header: React.FC = () => (
  <header className="main-header">
    <div className="header-content">
      <span className="header-logo">RouteFinder</span>
      <nav className="header-nav">
        <a href="#" className="header-link">
          Home
        </a>
        <a href="#" className="header-link">
          Features
        </a>
        <a href="#" className="header-link">
          Contact
        </a>
      </nav>
    </div>
  </header>
);

export default Header;
