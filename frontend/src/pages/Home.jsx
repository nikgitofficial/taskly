import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Home.jsx
// This is a simple home page component that includes a calculator functionality
const Home = () => {
  const { logout, user } = useAuth(); 
  const navigate = useNavigate();
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [result, setResult] = useState(0);
  const [operation, setOperation] = useState("");

const handleLogout = () => {
logout();
navigate("/login");
  };
  const handleAdd = () => {
  setResult(parseFloat(number1) + parseFloat(number2));
};

const handleSubtract = () => {
  setResult(parseFloat(number1) - parseFloat(number2));
};

const handleMultiply = () => {
  setResult(parseFloat(number1) * parseFloat(number2));
};

const handleDivide = () => {
  if (parseFloat(number2) === 0) {
    setResult("Cannot divide by zero");
  } else {
    setResult(parseFloat(number1) / parseFloat(number2));
  }
};


const handleEqual = () => {
  const num1 = parseFloat(number1);
  const num2 = parseFloat(number2);

  switch (operation) {
    case "+":
      setResult(num1 + num2);
      break;
    case "-":
      setResult(num1 - num2);
      break;
    case "*":
      setResult(num1 * num2);
      break;
    case "/":
      if (num2 === 0) {
        setResult("Cannot divide by zero");
      } else {
        setResult(num1 / num2);
      }
      break;
    default:
      setResult("Choose an operation");
  }
};


  return (
    <div>
      
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of your application.</p>
           <button onClick={handleLogout}>Logout</button>
      <>
  
       <input type="number"  value={number1}  onChange={(e) => setNumber1(e.target.value)} placeholder="number1"/>
      <input type="number"  value={number2}  onChange={(e) => setNumber2(e.target.value)} placeholder="number2"/>
      
       <button onClick={() => setOperation("+")}>+</button>
<button onClick={() => setOperation("-")}>-</button>
<button onClick={() => setOperation("*")}>*</button>
<button onClick={() => setOperation("/")}>/</button>

        <button onClick={handleEqual}>=</button>
     <p>Result: {result}</p>
     </>
    </div>
  );
};

export default Home;
