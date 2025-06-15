import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Header: React.FC<{
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}> = ({ sidebarCollapsed, setSidebarCollapsed }) => (
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
      {/* Collapse/Expand button at the far left of the header */}
      <button
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        style={{
          background: "#fff",
          border: "1px solid #e0e7ef",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px #e0e7ef44",
          cursor: "pointer",
          marginLeft: 0,
          marginRight: 20,
        }}
      >
        {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
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
