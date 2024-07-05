import React, { useEffect, useState } from 'react';
import './Order.css';
import { CheckCircle, AlertCircle, XCircle, Clock, ExternalLink } from 'react-feather';
import Sidebar from '../../Sidebar/Sidebar';
import { useLocation } from 'react-router-dom';
import { CheckCircleFill } from 'react-bootstrap-icons';
import { useSidebar } from '../../../ContextAPI/SidebarContext';

const OrderDetails = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [orderDet, setOrderDetails] = useState(null);
  const location = useLocation();
  const orderDetails = location.state.orderWithItems;

  const deliveryStatusStages = [
    { status: 'Processing', time: '2 days ago' },
    { status: 'Shipped', time: '1 day ago' },
    { status: 'Out for Delivery', time: 'Now' },
    { status: 'Delivered', time: 'Expected tomorrow' }
  ];

  const fetchSalesEmployeeNames = async (salesEmpId) => {
    try {
      const salesEmployeeData = await fetch(`https://api.chesadentalcare.com/sales_emp/${salesEmpId}`);
      const salesEmployee = await salesEmployeeData.json();
      if (salesEmployee) {
        setOrderDetails(prevOrderDetails => ({
          ...prevOrderDetails,
          SalesEmpName: salesEmployee.SalesEmpName || 'Unknown'
        }));
      }
    } catch (error) {
      console.error('Error fetching sales employee name:', error);
    }
  };

  useEffect(() => {
    if (orderDetails) {
      fetchSalesEmployeeNames(orderDetails.SalesEmp);
    }
  }, [orderDetails]);

  return (
    <>
      <Sidebar />
      <div className={`sales-dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ backgroundColor: 'rgba(242, 242, 242, 1.97)'}}>
                <div className='first' style={{ backgroundColor: '#f2f2f2', padding: '20px', textAlign: 'start', borderRadius: '8px', position: 'relative', top: '15px' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', margin: '-30px', fontWeight: "bold", position: 'relative', top: '5px', left: '23px' }}>
                        Navigate to Chesa Services
                        <a href="https://chesadentalcare.com" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '5px' }} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={20} />
                        </a>
                    </p>

                </div>
        <div className="header">
          <h1 className="company-name1" style={{ textAlign: "start", border: "5px" }}>ORDER DETAILS FOR ORDER <span style={{ color: "red" }}>{orderDetails.OrderNumber}</span></h1><br /><br />
        </div>

        <div className="order-details-container">
          <div className="main-content">

            <table className="bordered-table">
              <h2>BASIC DETAILS</h2>
              <tbody>
                <tr>
                  <td>Order ID:</td>
                  <td style={{ fontWeight: "bold" }}>{orderDetails.OrderID}</td>
                </tr>
                <tr>
                  <td>Order Number:</td>
                  <td style={{ fontWeight: "bold", color: "green" }}>{orderDetails.OrderNumber}</td>
                </tr>
                <tr>
                  <td>Order Date:</td>
                  <td>{orderDetails.OrderDate}</td>
                </tr>
                <tr>
                  <td>Dispatch Date:</td>
                  <td>{orderDetails.ExpectedDispatchDate}</td>
                </tr>
                <tr>
                  <td>Customer Name:</td>
                  <td style={{ fontWeight: "bold", color: "green" }}>{orderDetails.CustomerName}</td>
                </tr>
                <tr>
                  <td >Sales Employee Name:</td>
                  <td style={{ fontWeight: "bold", color: "darkblue" }}>{orderDet ? orderDet.SalesEmpName : 'Loading...'}</td>
                </tr>
                <tr>
                  <td>Order Status:</td>
                  <td>
                    {orderDetails.OrderStatus === 'Job Card Issued' ? (
                      <span style={{ color: 'purple' }}>
                        <Clock size={16} />
                        Job Card Issued
                      </span>
					  ) :  orderDetails.OrderStatus === 'Delivered' ? (
                      <div className="order-status11 delivered11">
                        <CheckCircle className="success-icon" />
                        Delivered
                      </div>
                  
                    ) : orderDetails.OrderStatus === 'Approved For Dispatch' ? (
                      <span style={{ color: 'blue' }}>
                        <CheckCircle size={16} />
                        Approved for Dispatch
                      </span>
                    ) : orderDetails.OrderStatus === 'Ready For Dispatch' ? (
                      <span style={{ color: 'purple' }}>
                        <Clock size={16} />
                        Ready for Dispatch
                      </span>
                    ) : orderDetails.OrderStatus === 'Dispatched' ? (
                      <div className="order-status11 dispatched11">
                        <CheckCircleFill className="success-icon11" />
                        Dispatched
                      </div>
                    ) : (
                      <span style={{ color: 'red' }}>
                        <AlertCircle size={16} />
                        Unknown Status
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Doc Status:</td>
                  <td style={{ fontWeight: "bold", color: "green" }}>{orderDetails.DocStatus}</td>
                </tr>
                <tr>
                  <td>Color:</td>
                  <td>{orderDetails.Color}</td>
                </tr>
              </tbody>
            </table>

            
            <h2>PRODUCT DETAILS</h2>
            <table className="product-info">
            
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Item Code</th>
                  <th>Quantity</th>
                  <th>Line Status</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((order, index) => (
                  <tr key={index}>
                    <td>{order.ItemDescription}</td>
                    <td>{order.ItemCode}</td>
                    <td>{order.Quantity}</td>
                    <td>{order.LineStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
		  
		  <div className="row" style={{ marginTop: '20px',marginLeft: '20px'}}>
            <div className="col-md-4">
                <div className="card">
                    <div className="card-body" style={{ backgroundColor: '#fff', color: '#000', height: '250px', border: '2px solid #ffa353' }}>
                        <h4 className="header-title mb-3">Shipping Details</h4>
                        <hr style={{ borderTop: '2px solid #ffa353' }} />
                        <p className="mb-2"><span className="fw-bold">Address:</span>{orderDetails.Address}</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card">
                    <div className="card-body" style={{ backgroundColor: '#fff', color: '#000', height: '250px', border: '2px solid #ffa353' }}>
                        <h4 className="header-title mb-3">Billing Details</h4>
                        <hr style={{ borderTop: '2px solid #ffa353' }} />
                        <p className="mb-2"><span className="fw-bold">Address:</span> {orderDetails.BillingAddress}</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card">
                    <div className="card-body" style={{ backgroundColor: '#fff', color: '#000', height: '250px', border: '2px solid #ffa353' }}>
                        <h4 className="header-title mb-3">More Information</h4>
                        <hr style={{ borderTop: '2px solid #ffa353' }} />
                        <ul className="list-unstyled mb-0">
                          {deliveryStatusStages.map((stage, index) => (
							<li key={index}>
							  <strong>{stage.status}</strong>: {stage.time}
							</li>
						  ))}
						</ul>
                    </div>
                </div>
            </div>
        
		 </div>  
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
