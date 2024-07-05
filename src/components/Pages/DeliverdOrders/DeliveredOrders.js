import React, { useState, useEffect } from 'react';
import { ExternalLink, X } from 'react-feather'; // Import X icon
// import './Shipped.css';
import Skeleton from 'react-loading-skeleton'; 
import { CheckCircle, AlertCircle, XCircle, Clock, Eye, Edit } from 'react-feather'; // Import Eye and Edit icons
import Sidebar from '../../Sidebar/Sidebar';
import LoadingAnimation from '../../Loading/Loading';
import Modal from '../../Products/Modal';
import StatusUpdateModal from '../../Products/StatusUpdateModal'; // Import StatusUpdateModal
import { CheckCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../../ContextAPI/SidebarContext';

const DeliveredOrders = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5);
  const [orders, setOrders] = useState([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderDateSortOrder, setOrderDateSortOrder] = useState('asc');
  const [dispatchDateSortOrder, setDispatchDateSortOrder] = useState('asc');
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
  const [status, setStatus] = useState(''); // Define status state

  
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch('http://35.154.172.240:3005/delivered_orders')
      .then(response => response.json())
      .then(data => {
        setOrders(data);
        fetchSalesEmployeeNames(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      });
  }, []);

  const fetchSalesEmployeeNames = async (data) => {
    for (const order of data) {
      if (order.SalesEmp) {
        try {
          const response = await fetch(`http://35.154.172.240:3001/shipped_orders/${order.SalesEmp}`);
          const salesEmployeeData = await response.json();
          setOrders(prevOrders => {
            return prevOrders.map(prevOrder => {
              if (prevOrder.OrderID === order.OrderID) {
                return { ...prevOrder, salesEmployeeName: salesEmployeeData.SalesEmpName };
              }
              return prevOrder;
            });
          });
        } catch (error) {
          console.error('Error fetching sales employee name:', error);
        }
      }
    }
  };

  const handleActionClick = (orderId, orderItems) => {
    setSelectedOrderId(orderId);
    setSelectedOrderItems(orderItems);
    setIsModalOpen(true);
  };

  const handleUpdateClick = (orderId, orderItems) => {
    setSelectedOrderId(orderId);
    setSelectedOrderItems(orderItems);
    setIsSecondModalOpen(true);
  };

  const handleViewClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown menu
  };

  const handleOrderDetailsClick = (orderId) => {
    const orderDetails = orders.find(order => order.OrderID === orderId);
    if (orderDetails) {
      const orderItems = orders.filter(order => order.OrderID === orderId);
      const orderWithItems = { ...orderDetails, orderItems };
      navigate(`/order_details/${orderId}`, { state: { orderWithItems } });
      console.log(orderWithItems);
    } else {
      console.error('Order details not found');
    }
  };
 

  const handleStatusUpdateClick = (orderId) => {
    setSelectedOrderId(orderId);
    setSelectedStatus(status); // Use the status from state
    setIsStatusUpdateModalOpen(true);
  };


  const handleCloseModal = () => {
    setSelectedOrderId(null);
    setSelectedOrderItems([]);
    setIsModalOpen(false);
  };

  const handleCloseSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  const handleOrderDateSort = () => {
    sortTable('Order Date');
  };

  const handleDispatchDateSort = () => {
    sortTable('Expected Dispatch Date');
  };

  const parseDate = (dateString) => {
    const parts = dateString.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  const sortTable = (dateType) => {
    const table = document.getElementById('bordered-table');
    const rows = Array.from(table.rows).slice(1); // Exclude header row
    let colIndex = 0;

    switch (dateType) {
      case 'Order Date':
        colIndex = 2;
        setOrderDateSortOrder(orderDateSortOrder === 'asc' ? 'desc' : 'asc');
        break;
      case 'Expected Dispatch Date':
        colIndex = 3;
        setDispatchDateSortOrder(dispatchDateSortOrder === 'asc' ? 'desc' : 'asc');
        break;
      default:
        break;
    }

    const sortOrder = dateType === 'Order Date' ? orderDateSortOrder : dispatchDateSortOrder;

    rows.sort((a, b) => {
      const dateA = parseDate(a.cells[colIndex].textContent);
      const dateB = parseDate(b.cells[colIndex].textContent);

      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Clear existing rows
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    // Add new rows
    rows.forEach(row => table.appendChild(row));


    Array.from(table.rows[0].cells).forEach(cell => {
      cell.classList.remove('asc', 'desc');
    });

    table.rows[0].cells[colIndex].classList.add(sortOrder === 'asc' ? 'asc' : 'desc');
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.OrderID]) {
      acc[order.OrderID] = [];
    }
    acc[order.OrderID].push(order);
    return acc;
  }, {});

  const groupedOrdersArray = Object.values(groupedOrders);

  const filteredOrders = groupedOrdersArray.filter(orderGroup =>
    orderGroup.some(order => order.OrderNumber.toString().includes(searchTerm.toString()))
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <>
      <div className={`sales-dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ backgroundColor: 'rgba(242, 242, 242, 1.97)'}}>
        <div className='first' style={{ backgroundColor: '#f2f2f2', padding: '20px', textAlign: 'start', borderRadius: '8px' }}>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', margin: '0', fontWeight: "bold" }}>
            Navigate to Chesa Services
            <a href="https://chesadentalcare.com" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '5px' }} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={20} />
            </a>
          </p>
        </div>
        <div className="header">
          <h1 className="company-name1">DELIVERED ORDERS</h1>
        </div>
        <Sidebar />
        <div className="main-content">
          <div className="search-bar-container" style={{position: 'relative', left :'128vh', marginTop : '0px', margin : '0px'}}>
            <input
              type="text"
              placeholder=" Search..."
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X
                className="clear-icon"
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
          <div className="entries-info">
            Showing {currentEntries.length} of {filteredOrders.length} entries
          </div>
          <table id="bordered-table" className="bordered-table">
            <thead className='th'>
              <tr>
                <th>Order ID</th>
                <th>Order Number</th>
                <th>
                  <span onClick={handleOrderDateSort} style={{ cursor: "pointer" }}>Order Date</span>
                </th>
                <th>
                  <span onClick={handleDispatchDateSort} style={{ cursor: "pointer" }}>Dispatch Date</span>
                </th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Color</th>
                <th>Order Status</th>
                <th>Doc Status</th>
                <th>Sales Employee Name</th>
                <th>Products</th>
                <th>Action</th>
              </tr>
            </thead>
            {isLoading ? (
          // Render loading skeletons while data is being fetched
          <tbody><br /> <br /> <br /><br />
           <div class="loader21" style={{position : 'relative', left: '700%'}}></div><br />
           {/* <div className='load'>Loading...</div><br /> <br /><br /> */}
          </tbody>
        ) : filteredOrders.length === 0 ? (
          <tbody>
              <tr>
                  <td colSpan="12" style={{ textAlign: "center", paddingTop: "50px" }}>
                      <div className="no-orders-container">
                          <img src={require("../ReadyForDispatch/data.png")} alt="No Orders Found" className="no-orders-image" />
                          <p className="no-orders-text">No orders found</p>
                      </div>
                  </td>
              </tr>
          </tbody>
      ) : (
              <tbody>
                {currentEntries.map(orderGroup => (
                  <tr key={orderGroup[0].OrderNumber}>
                    <td>{orderGroup[0].OrderID}</td>
                    <td>{orderGroup[0].OrderNumber}</td>
                    <td>{orderGroup[0].OrderDate}</td>
                    <td>{orderGroup[0].ExpectedDispatchDate}</td>
                    <td>{orderGroup[0].CustomerName}</td>
                    <td>{orderGroup[0].Address}</td>
                    <td>{orderGroup[0].Color}</td>
                    <td>
                      {orderGroup[0].OrderStatus === 'Delivered' ? (
                        <div className="order-status delivered">
                          <CheckCircle className="success-icon" />
                          Delivered
                        </div>
                      ) : orderGroup[0].OrderStatus === 'Approved For Dispatch' ? (
                        <span style={{ color: 'blue' }}>
                          <CheckCircle size={16} />
                          Approved for Dispatch
                        </span>
                      ) : orderGroup[0].OrderStatus === 'Ready For Dispatch' ? (
                        <span style={{ color: 'purple' }}>
                          <Clock size={16} />
                          Ready for Dispatch
                        </span>
                      ) : orderGroup[0].OrderStatus === 'Dispatched' ? (
                        <div className="order-status dispatched">
                          <CheckCircleFill className="success-icon1" />
                          Dispatched
                        </div>
                      ) : (
                        <span style={{ color: 'red' }}>
                          <AlertCircle size={16} />
                          Unknown Status
                        </span>
                      )}
                    </td>
                    <td>{orderGroup[0].DocStatus}</td>
                    <td>{orderGroup[0].salesEmployeeName || 'Loading ...'}</td>
                    <td>
                      <button onClick={() => handleActionClick(orderGroup[0].OrderID, orderGroup)} className="action-button1">View Products</button>
                    </td>
                    <td>
                      {/* Replace button with icons for view details and update order */}
                      <div className="action-icons2">
                        <div className="action-icon2" title="View Details" style={{cursor: "pointer"}}>
                          <td>
                          <button  onClick={() => handleOrderDetailsClick(orderGroup[0].OrderID)}>
                          <Eye
                            className="view-icon2"
                           
                          /><span>View Order</span>

                          </button>
                          </td>
                          
                        </div>

                        <div className="action-icon2" title="Update Status" style={{cursor: "pointer"}}>
                          <td className='imtd'>
                          <button className='button55'  onClick={() => handleStatusUpdateClick(orderGroup[0].OrderID, orderGroup[0].OrderStatus)}>
                          <Edit
                            className="update-icon2"
                            style={{cursor: "pointer"}}
                            // Pass order status as status argument
                          />
                          <span>Update Status</span>

                          </button>
                          </td>
                          
                        </div>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            )}

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

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          selectedOrderItems={selectedOrderItems}
        />
      )}

      {isStatusUpdateModalOpen && ( // Render status update modal if open
        <StatusUpdateModal
          isOpen={isStatusUpdateModalOpen}
          onRequestClose={() => setIsStatusUpdateModalOpen(false)}
          orderId={selectedOrderId}
          
        />
      )}




    </>
  );
};

export default DeliveredOrders;
