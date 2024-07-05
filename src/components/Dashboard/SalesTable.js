import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SalesDashboard.css'; // Import CSS file for styling
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar component
import backgroundImage from './chesa.png'; // Import the image
import { CheckCircleFill, Truck, XCircleFill } from 'react-bootstrap-icons';
import { ExternalLink } from 'react-feather';
import Footer from '../Footer/Footer';

const SalesDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5); // Set number of entries per page

  const orders = [
    {
      orderNumber: '12345',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'In Transit', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '12346',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'Delivered', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '12347',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'Delivered', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '12348',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'Not Delivered', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '12349',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'Delivered', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '22345',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'Delivered', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '32345',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'In Transit', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '42345',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'Delivered', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    {
      orderNumber: '52345',
      orderDate: '2024-02-17',
      dispatchDate: '2024-02-18',
      products: ['Product A', 'Product B'],
      dealerName: 'Dealer X',
      customerName: 'Customer Y',
      totalAmount: 1000,
      paidAmount: 800,
      pendingAmount: 200,
      orderStatus: 'Not Delivered', // Change the order status to 'Delivered'
      logisticPartner: 'Logistic Partner 1'
    },
    // Add more sample orders as needed
  ];

  const handleActionClick = (orderId) => {
    // Handle action click, such as updating tracking or showing order details
    console.log(`Clicked action for order ${orderId}`);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <>

      <div className="sales-dashboard" style={{ backgroundColor: 'rgba(242, 242, 242, 1.97)', position: 'absolute', left: "18%", width: '1120px', height: '800px' }}>
        <div className='first' style={{ backgroundColor: '#f2f2f2', padding: '20px', textAlign: 'start', borderRadius: '8px' }}>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', margin: '0', fontWeight: "bold" }}>
            Navigate to Chesa Services
            <a href="https://chesadentalcare.com" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '5px' }} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={20} />
            </a>
          </p>
        </div>
        <div className="header">

          <h1 className="company-name1" style={{ textAlign: "start", left: "1%", border: "5px", }}>ONGOING ORDERS</h1>
        </div>
        <Sidebar /> {/* Integrate Sidebar component */}
        <div className="main-content">
          <input
            type="text"
            placeholder=" Search..."
            className="search-bar-container"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="entries-info">
            Showing {currentEntries.length} of {filteredOrders.length} entries
          </div>
          <table className="bordered-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Order Date</th>
                <th>Dispatch Date</th>
                <th>Products</th>
                <th>Dealer Name</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Order Status</th>
                <th>Logistic Partner</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map(order => (
                <tr key={order.orderNumber}>
                  <td>{order.orderNumber}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.dispatchDate}</td>
                  <td>{order.products.join(', ')}</td>
                  <td>{order.dealerName}</td>
                  <td>{order.customerName}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.paidAmount}</td>
                  <td>{order.pendingAmount}</td>


                  <td>
  {order.orderStatus === 'Delivered' && (
    <div className="order-status delivered">
      <CheckCircleFill className="success-icon" />
      Delivered
    </div>
  )}
  {order.orderStatus === 'In Transit' && (
    <div className="order-status in-transit">
      <Truck className="success-icon" />
      In Transit
    </div>
  )}
  {order.orderStatus !== 'Delivered' && order.orderStatus !== 'In Transit' && (
    <div className="order-status not-delivered">
      <XCircleFill className="success-icon" /> {" "}
      Not Delivered
    </div>
  )}
</td>


                  <td>{order.logisticPartner}</td>
                  <td>
                    <button onClick={() => handleActionClick(order.orderNumber)} className="action-button">Actions</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Prev
            </button>
            <div className="page-numbers">
              {[...Array(Math.ceil(filteredOrders.length / entriesPerPage)).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => setCurrentPage(number + 1)}
                  className={currentPage === number + 1 ? 'active page-button' : 'page-button'}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredOrders.length / entriesPerPage)}
              className="pagination-button"
            >
              Next
            </button>
          </div>

        </div>
        {/* <Footer /> */}
      </div>

    </>
  );
};

export default SalesDashboard;
