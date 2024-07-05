import React, { useState, useEffect } from 'react';
import { getOrderDetails, updateOrderStatus } from 'api'; 


const UpdateOrder = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch order details when component mounts
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderDetails(orderId);
        setOrder(orderData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    // Update order status
    try {
      await updateOrderStatus(orderId, newStatus);
      // Optionally, you can refresh order details here
      // Or update local state to reflect the change
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found!</div>;
  }

  return (
    <div className="update-order-container">
      <h2>Order Details</h2>
      <p>Order ID: {order.orderID}</p>
      <p>Order Number: {order.orderNumber}</p>
      <p>Order Status: {order.orderStatus}</p>
      {/* Render other fields here */}
      <p>Products: {order.products.join(', ')}</p> {/* Assuming products is an array */}
      
      <div className="update-status">
        <h3>Update Status</h3>
        <input 
          type="text" 
          value={newStatus} 
          onChange={(e) => setNewStatus(e.target.value)} 
          placeholder="Enter new status" 
        />
        <button onClick={handleStatusUpdate}>Update Status</button>
      </div>
      
      {/* Add CSS for styling */}
      <style jsx>{`
        .update-order-container {
          // Your styles here
        }
        .update-status {
          // Your styles here
        }
      `}</style>
    </div>
  );
};

export default UpdateOrder;
