import React from "react";

const Header: React.FC = () => (
  <header className="main-header">
    <div
      className="header-content"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span className="header-logo" style={{ textAlign: "left" }}>
        RouteFinder
      </span>
      <nav className="header-nav" style={{ display: "flex", gap: "1.7rem" }}>
        <a href="#" className="header-link">
          Home
        </a>
        <a href="#" className="header-link">
          Features
        </a>
        <a href="#" className="header-link">
          Contact
        </a>
        {/* Add more buttons here easily */}
      </nav>
    </div>
  </header>
);

export default Header;
