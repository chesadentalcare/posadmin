import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Grn.css'; 
import Sidebar from '../../Sidebar/Sidebar';

const Grn = () => {
    const [grnNumbers, setGrnNumbers] = useState([]);
    const [serialNumbers, setSerialNumbers] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const orderDetails = location.state.orderWithItem;

    const handleAllocateGrn = async () => {
        try {
            const orderNumber = orderDetails.OrderNumber;
            // Iterate through each item to send individual entries
            for (let i = 0; i < orderDetails.orderItems.length; i++) {
                const product = orderDetails.orderItems[i];
                const productId = product.ItemCode;
                const quantity = product.Quantity;
                
                // Iterate through the quantity of each product
                for (let j = 0; j < quantity; j++) {
                    // Get GRN and serial numbers for the current product instance
                    const grn = grnNumbers[i * quantity + j] || null;
                    const serialNumber = serialNumbers[i * quantity + j] || null;

                    // Send individual entries to the backend
                    const response = await fetch('https://chesadentalcare.com/Logistics/apis/postgrn.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ord_number: orderNumber,
                            grn: grn ? grn.number : null, // Send null if no GRN number provided
                            serial_number: serialNumber ? serialNumber.number : null // Send null if no serial number provided
                        }),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to post GRN numbers');
                    }
                    console.log(`GRN and serial numbers for product ${productId} successfully posted`);
                }
            }
            console.log('All GRN and serial numbers successfully posted');
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage('Error posting GRN numbers');
            console.error('Error posting GRN and serial numbers:', error.message);
        }
    };

    const handleGrnChange = (index, event) => {
        const newGrnNumbers = [...grnNumbers];
        newGrnNumbers[index] = { number: event.target.value };
        setGrnNumbers(newGrnNumbers);
    };

    const handleSerialNumberChange = (index, event) => {
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers[index] = { number: event.target.value };
        setSerialNumbers(newSerialNumbers);
    };

    const handleRemoveProduct = (productId, itemIndex) => {
        const updatedOrderItems = [...orderDetails.orderItems];
        const productIndex = updatedOrderItems.findIndex(product => product.ItemCode === productId);
        if (productIndex !== -1) {
            const product = updatedOrderItems[productIndex];
            if (product.Quantity === 1) {
                // If there's only one instance of this product, remove the entire product
                updatedOrderItems.splice(productIndex, 1);
            } else {
                // If there are multiple instances, remove only the specific instance
                product.Quantity--;
            }
        }
        const newGrnNumbers = [...grnNumbers];
        newGrnNumbers.splice(itemIndex, 1);
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers.splice(itemIndex, 1);
        setGrnNumbers(newGrnNumbers);
        setSerialNumbers(newSerialNumbers);
        orderDetails.orderItems = updatedOrderItems;
    };
    

    if (!orderDetails) {
        return <div>Loading order details...</div>;
    }

    return (
        <>
            <Sidebar />
            <div className="grn-container">
                <h2 className="title">GRN Creation for Order: {orderDetails.OrderNumber}</h2>
                <div className="customer-info">
                    <p><strong>Customer Name:</strong> {orderDetails.CustomerName}</p>
                    <p><strong>Address:</strong> {orderDetails.Address}</p>
                </div>
                <div className="product-list">
                    {orderDetails.orderItems.map((product, index) => (
                        Array.from({ length: product.Quantity }).map((_, itemIndex) => {
                            const productId = product.ItemCode;
                            const uniqueIndex = index * product.Quantity + itemIndex;
                            return (
                                <div className="product" key={`${productId}-${itemIndex}`}>
                                    <div className="product-image"></div>
                                    <div className="product-details">
                                        <p><strong>Product ID:</strong> {productId}</p>
                                        <p><strong>Product Name:</strong> {product.ItemDescription}</p>
                                    </div>
                                    <div className="input-fields">
                                        <input
                                            type="text"
                                            placeholder="Enter Serial Number"
                                            value={(serialNumbers[uniqueIndex] || {}).number || ''}
                                            onChange={e => handleSerialNumberChange(uniqueIndex, e)}
                                            disabled={showSuccessModal}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Enter GRN Number"
                                            value={(grnNumbers[uniqueIndex] || {}).number || ''}
                                            onChange={e => handleGrnChange(uniqueIndex, e)}
                                            disabled={showSuccessModal}
                                        />
                                        <button onClick={() => handleRemoveProduct(productId, index)}>Remove</button>

                                    </div>
                                </div>
                            );
                        })
                    ))}
                </div>
                <button className='bttn1' onClick={handleAllocateGrn}>Allocate GRN</button>
            </div>
            {showSuccessModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
                    <p>GRN & Serial numbers numbers successfully allocated</p>
                </div>
            </div>
        )}
        {errorMessage && (
            <div className="error-message">
                <p>{errorMessage}</p>
            </div>
        )}
        </>
    );
};

export default Grn;
