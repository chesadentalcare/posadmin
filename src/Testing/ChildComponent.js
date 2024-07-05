import React from "react";


function ChildComponent({isActive, toggleButton}){


    return (

        <div>
            <h1></h1>
            <button onClick={toggleButton}>{isActive? "Deactivate" : "Activate"}</button>
            <p>Child Side  <span style={{color: "green"}}>{isActive? "Active" : "Inctive"}</span></p>
        </div>
    )
}

export default ChildComponent;