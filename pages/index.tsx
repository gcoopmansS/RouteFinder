import React from "react";
import Header from "../components/Header";
import RoutePlanner from "../components/RoutePlanner";

const Home: React.FC = () => {
  return (
    <div className="landing-container">
      <Header />
      <RoutePlanner />
    </div>
  );
};

export default Home;
