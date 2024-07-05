import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const [count, setCount]= useState(0);
  const navigate= useNavigate();



  function clickCounter(){
    setCount(count+10);
    navigate('/all_orders');

  }

  return(
    <>
    <div>
      <h1>Testing Counter</h1>
    </div>
    <button onClick={clickCounter}>Click</button>
    <div>
    <p>Counter is : {count}</p>
    </div>
    
    
    </>
  )
  
}

export default Test;