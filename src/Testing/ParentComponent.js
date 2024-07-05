import React, { useState } from "react";
import ChildComponent from "./ChildComponent";

function ParentComponent(){
    const[isActive, setIsActive]= useState(false);


    function toggleButton(){
        setIsActive(!isActive);
    }

    return(
        <div>
            <h1>Parent Component (Lifting state of child component up)</h1>
            <ChildComponent isActive={isActive} toggleButton={toggleButton} />
            <p>Parent Side  <span style={{color: "green"}}>{isActive? "Active" : "Inactive"}</span></p>
        </div>
    )
}



export default ParentComponent;


