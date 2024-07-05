import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DC.css';

const DCCreationModal = ({ orderNumber, onClose, onConfirm, products }) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [confirmedSerialNumber, setConfirmedSerialNumber] = useState('');
  const [error, setError] = useState('');
  console.log(products);
  const navigate= useNavigate();

  // Flatten the array of arrays into a single array of products
  const flattenedProducts = products.flat();

  // Count occurrences of each ItemCode
  const itemCounts = flattenedProducts.reduce((acc, product) => {
    acc[product.ItemCode] = (acc[product.ItemCode] || 0) + 1;
    return acc;
  }, {});

  const handleConfirm = () => {
    if (serialNumber === confirmedSerialNumber) {
      // onConfirm(serialNumber);
      navigate('/grn')
      onClose();
    } else {
      setError('Serial numbers do not match');
    }
  };

  return (
    <div className="dc-creation-modal">
      <div className="modal-content">
        <h2>DC creation for Order <span style={{ color: "red"}}>{orderNumber}</span></h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              {/* Add other table headers here */}
            </tr>
          </thead>

        </table>
        <label htmlFor="serialNumber">Enter Serial Number:</label>
        <input
          type="text"
          id="serialNumber"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        <label htmlFor="confirmedSerialNumber">Confirm Serial Number:</label>
        <input
          type="text"
          id="confirmedSerialNumber"
          value={confirmedSerialNumber}
          onChange={(e) => setConfirmedSerialNumber(e.target.value)}
        /><br />
        {error && <p className="error">{error}</p>}
        <div className="button-container">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DCCreationModal;
