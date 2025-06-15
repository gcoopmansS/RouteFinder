import React, { useState } from "react";
import Header from "../components/Header";
import RoutePlanner from "../components/RoutePlanner";

const Home: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <>
      <Header
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <RoutePlanner
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </>
  );
};

export default Home;
