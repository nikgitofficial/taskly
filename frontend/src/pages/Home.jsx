import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Home.jsx
// This is a simple home page component that includes a calculator functionality
const Home = () => {
 

  return (
    <div>
      
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of your application.</p>
   
    </div>
  );
};

export default Home;
