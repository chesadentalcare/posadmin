import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import './ProductionRouting.css'; // Import CSS file for styling
import Sidebar from '../Sidebar/Sidebar';

const ProductionRouting = () => {
  const [consumedMaterials, setConsumedMaterials] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Fabrication'); // Initially selected stage is Fabrication
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleAddConsumedMaterial = (material) => {
    // Add the selected stage to the material
    const materialWithStage = { ...material, stage: selectedOption };
    setConsumedMaterials([...consumedMaterials, materialWithStage]);
  };

  const handlePostToSAP = () => {
    console.log("Posting consumed materials to SAP B1:", consumedMaterials);
    setConsumedMaterials([]);
    // Implement logic to post consumed materials to SAP B1
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const material = { name, quantity: parseInt(quantity) };
    handleAddConsumedMaterial(material);
    setName('');
    setQuantity(0);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Sidebar />
      <div className="production-routing-container">
        <h2>Production Routing</h2>
        <div className="options-container">
          <div className={`option-checkbox ${selectedOption === 'Fabrication' ? 'selected' : ''}`} onClick={() => handleOptionSelect('Fabrication')}>
            {selectedOption === 'Fabrication' && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
            Fabrication
          </div>
          <div className={`option-checkbox ${selectedOption === 'Painting' ? 'selected' : ''}`} onClick={() => handleOptionSelect('Painting')}>
            {selectedOption === 'Painting' && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
            Painting
          </div>
          <div className={`option-checkbox ${selectedOption === 'Assembly' ? 'selected' : ''}`} onClick={() => handleOptionSelect('Assembly')}>
            {selectedOption === 'Assembly' && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
            Assembly
          </div>
          <div className={`option-checkbox ${selectedOption === 'Completed' ? 'selected' : ''}`} onClick={() => handleOptionSelect('Completed')}>
            {selectedOption === 'Completed' && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
            Completed
          </div>
        </div>
        <h1 className='hi'>PRODUCTION CONSUMPTION</h1>
        <div className="consumption-container">
          <h3>Enter Consumed Material</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Material Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="add-button">
              <FontAwesomeIcon icon={faPlus} /> Add
            </button>
          </form>
        </div>
        <div className="consumption-container">
          <h3>Consumed Materials</h3>
          <ul>
            {consumedMaterials.map((material, index) => (
              <li key={index}>{material.name} - {material.quantity} - Stage: {material.stage}</li>
            ))}
          </ul>
        </div>
        <button className="post-button" onClick={handlePostToSAP}>
          <FontAwesomeIcon icon={faPlus} /> Post to SAP B1
        </button>
      </div>
    </>
  );
};

export default ProductionRouting;
