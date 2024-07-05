import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const CustomModal = ({ isOpen, onRequestClose, selectedOrderItems }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Order Items"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          overflow : 'auto'
        },
        content: {
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          width: '600px', // Adjust the width as needed
          margin: 'auto',
          position: 'relative'
        }
      }}
    >
      <button className="action-button" onClick={onRequestClose}>Close</button>
      <h2>Order Items</h2>
      <table> 
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Item Code</th>
            <th>Line Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedOrderItems.map((order, index) => (
            <tr key={index}>
              <td>{order.ItemDescription}</td>
              <td>{order.Quantity}</td>
              <td>{order.ItemCode}</td>
              <td>{order.LineStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
};

export default CustomModal;
