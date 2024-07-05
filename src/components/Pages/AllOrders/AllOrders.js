import React, { useState, useEffect } from 'react';
import { ExternalLink, X } from 'react-feather';
import Sidebar from '../../Sidebar/Sidebar';
import '../../Dashboard/Allorders.css';
import Modal from '../../Products/Modal';
import { CheckCircle, AlertCircle, Dribbble, XCircle, Clock, Eye, Edit } from 'react-feather';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalWrapper from '../../Filter/ModalWrapper';
import StatusUpdateModal from '../../Products/StatusUpdateModal'; // Import StatusUpdateModal
import { CheckCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import NotificationButton from '../../../Notification/NotificationButton';
import { useAuth } from '../../../ContextAPI/AuthContext';
import { useSidebar } from '../../../ContextAPI/SidebarContext';
import  CardHeader  from '../../CardHeader/CardHeader';




const salesEmpCache = {};



const AllOrders = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const [expDate, setExpDate] = useState("")
    const [searchTerm, setSearchTerm] = useState('');
    const { user, token } = useAuth();  
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [entriesPerPage] = useState(10);
    const [orders, setOrders] = useState([]);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [orderByOrderDate, setOrderByOrderDate] = useState('asc');
    const [orderByDispatchDate, setOrderByDispatchDate] = useState('asc');
    const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
    const [isDCCreationModalOpen, setIsDCCreationModalOpen] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const navigate = useNavigate();
    const [authLoading, setAuthLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({
        month: '',
        year: '',
        status: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            setAuthLoading(false);
        }
    }, [user, token, navigate]);

  
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://api.chesadentalcare.com/open_orders');
    
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
    
                const data = await response.json();
                setOrders(data);
    
                const uniqueSalesEmpIds = [...new Set(data.map(order => order.SalesEmp))].filter(id => id); // Filter out null or invalid IDs
                // console.log(uniqueSalesEmpIds);
    
                const salesEmpMap = {};
    
                // Fetch each sales employee data separately
                for (const id of uniqueSalesEmpIds) {
                    if (salesEmpCache[id]) {
                        salesEmpMap[id] = salesEmpCache[id];
                    } else {
                        const salesEmpResponse = await fetch(`https://api.chesadentalcare.com/sales_emp/${id}`);
                        if (!salesEmpResponse.ok) {
                            throw new Error(`Failed to fetch sales employee data for ID: ${id}`);
                        }
    
                        const salesEmpData = await salesEmpResponse.json();
                        // console.log(salesEmpData);
                        salesEmpMap[id] = salesEmpData.SalesEmpName;
                        salesEmpCache[id] = salesEmpData.SalesEmpName; // Cache the data
                    }
                }
    
                const ordersWithSalesEmpNames = data.map(order => ({
                    ...order,
                    salesEmployeeName: salesEmpMap[order.SalesEmp] || 'Unknown'
                }));
    
                console.log(ordersWithSalesEmpNames);
                setOrders(ordersWithSalesEmpNames);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setIsLoading(false);
                setError('Failed to fetch orders. Please try again later.');
            }
        };
    
        fetchOrders();
    }, []);
    
    
    
    
    
    if (authLoading) {
        return <div className='loader21'></div>;
    }


    const handleOrderDetailsClick = (orderId) => {
        const orderDetails = orders.find(order => order.OrderID === orderId);
        if (orderDetails) {
          const orderItems = orders.filter(order => order.OrderID === orderId);
          const orderWithItems = { ...orderDetails, orderItems };
          navigate(`/order_details/${orderId}`, { state: { orderWithItems } });
          // console.log(orderWithItems);
        } else {
          console.error('Order details not found');
        }
      };





    const handleStatusUpdateClick = (orderId, status, ExpectedDispatchDate) => {
        setSelectedOrderId(orderId);
        setExpDate(ExpectedDispatchDate)
        setIsStatusUpdateModalOpen(true);
    };


    const handleFilter = (filterOptions) => {
        const { month, year, status, docstatus } = filterOptions;

        let updatedFilteredOrders = orders.slice(); // Create a copy of the original orders

        // Filter orders based on selected month
        if (month) {
            updatedFilteredOrders = updatedFilteredOrders.filter(order => {
                const orderMonth = parseInt(order.OrderDate.split('-')[1]); // Extract month from "dd-mm-yyyy" format
                return orderMonth === parseInt(month);
            });
        }

        // Filter orders based on selected year
        if (year) {
            updatedFilteredOrders = updatedFilteredOrders.filter(order => {
                const orderYear = parseInt(order.OrderDate.split('-')[2]); // Extract year from "dd-mm-yyyy" format
                return orderYear === parseInt(year);
            });
        }

        // Filter orders based on selected status
        if (status) {
            updatedFilteredOrders = updatedFilteredOrders.filter(order => order.OrderStatus === status);
        }

        if (docstatus) {
            updatedFilteredOrders = updatedFilteredOrders.filter(order => order.DocStatus === docstatus);
        }


        // console.log(filterOptions);
        console.log(updatedFilteredOrders);

        setFilterOptions(filterOptions); // Update filter options state
        setFilteredOrders(updatedFilteredOrders); // Update filtered orders state
    };





    const handleActionClick = (orderId, orderItems) => {
        setSelectedOrderId(orderId);
        // console.log(orderItems)
        setSelectedOrderItems(orderItems);
        
        setIsModalOpen(true);
    };

    const handleViewClick = (orderId) => {
        toast.success("Action button clicked")
        setSelectedOrderId(orderId);
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown menu
    };



    const handleCloseModal = () => {
        setSelectedOrderId(null);
        setSelectedOrderItems([]);
        setIsModalOpen(false);
    };

    const handleOrderDateSort = () => {
        setOrderByOrderDate(orderByOrderDate === 'asc' ? 'desc' : 'asc');
    };

    const handleDispatchDateSort = () => {
        setOrderByDispatchDate(orderByDispatchDate === 'asc' ? 'desc' : 'asc');
    };

    const sortOrders = (data, orderBy, sortOrder) => {
        return data.slice().sort((a, b) => {
            const dateA = new Date(a[orderBy]);
            const dateB = new Date(b[orderBy]);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    };

    const groupedOrders = orders.reduce((acc, order) => {
        if (!acc[order.OrderID]) {
            acc[order.OrderID] = [];
        }
        acc[order.OrderID].push(order);
        // console.log(acc);
        return acc;
    }, {});

    const groupedOrders1 = filteredOrders.reduce((acc, order) => {
        if (!acc[order.OrderID]) {
            acc[order.OrderID] = [];
        }
        acc[order.OrderID].push(order);
        // console.log(acc);
        return acc;
    }, {});

    const groupedOrdersArray = Object.values(groupedOrders);
    const groupedOrdersArray1 = Object.values(groupedOrders1);

    const FilteredOrders = groupedOrdersArray.filter(orderGroup =>
        orderGroup.some(order => order.OrderNumber.toString().includes(searchTerm.toString()))
    );

    const FilteredOrders1 = groupedOrdersArray1.filter(orderGroup =>
        orderGroup.some(order => order.OrderNumber.toString().includes(searchTerm.toString()))
    );

    const sortedOrders = orderByOrderDate
        ? sortOrders(FilteredOrders, 'OrderDate', orderByOrderDate)
        : orderByDispatchDate
            ? sortOrders(FilteredOrders, 'ExpectedDispatchDate', orderByDispatchDate)
            : FilteredOrders;


    const sortedOrders1 = orderByOrderDate
        ? sortOrders(FilteredOrders1, 'OrderDate', orderByOrderDate)
        : orderByDispatchDate
            ? sortOrders(FilteredOrders1, 'ExpectedDispatchDate', orderByDispatchDate)
            : FilteredOrders1;



    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const indexOfLastEntry1 = currentPage1 * entriesPerPage;
    const indexOfFirstEntry1 = indexOfLastEntry1 - entriesPerPage;
    const currentEntries1 = sortedOrders1.slice(indexOfFirstEntry1, indexOfLastEntry1);
    const currentEntries = sortedOrders.slice(indexOfFirstEntry, indexOfLastEntry);
    // console.log(currentEntries);
    // const currentEntries1 = sortedOrders1.slice(indexOfFirstEntry1, indexOfLastEntry);
	
	
	

    return (
        <>
            <div className={`sales-dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ backgroundColor: 'rgba(242, 242, 242, 1.97)'}}>
                <div className='first' style={{ backgroundColor: '#f2f2f2', padding: '20px', textAlign: 'start', borderRadius: '8px', position: 'relative', top: '15px' }}>
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', margin: '-30px', fontWeight: "bold", position: 'relative', top: '5px', left: '23px' }}>
                        Navigate to Chesa Services
                        <a href="https://chesadentalcare.com" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '5px' }} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={20} />
                        </a>
                        <NotificationButton />
                    </p>

                </div>
				
                
                <div className="header">
                    <h1 className="company-name1">OPEN ORDERS LIST</h1><br />
                    <div style={{ position: "relative", right: "5%" }}>
                        { <ModalWrapper handleFilter={handleFilter} /> }
                    </div>

                </div>
                <Sidebar />
				
                <div className="main-content" style={{ left: "87%" }}>
				
				<CardHeader />	
				
                    <div className="search-bar-container" style={{ position: 'relative', left: '128vh', marginTop: '0px', margin: '0px' }}>
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
					
					<div>
                    {filterOptions.month || filterOptions.year || filterOptions.status ? (
                        <div className="entries-info">
                            Showing {currentEntries1.length} of {FilteredOrders1.length} entries
                        </div>
                    ) : (
                        <div className="entries-info">
                            Showing {currentEntries.length} of {FilteredOrders.length} entries
                        </div>
                    )}
					</div>



                    <table className="bordered-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Order Number</th>
                                <th>
                                    <span onClick={handleOrderDateSort}>Order Date</span>
                                </th>
                                <th>
                                    <span onClick={handleDispatchDateSort}>Dispatch Date</span>
                                </th>
                                <th>Customer Name</th>
                                <th>Address</th>
                                <th>Color</th>
                                <th>Order Status</th>
                                <th>Doc Status</th>
                                <th>Sales Employee Name</th>
                                <th>Products</th>
								<th>Doc Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            // Render loading skeletons while data is being fetched
                            <tbody><br /> <br /> <br /><br />
                                <div class="loader21" style={{position : 'relative', left: '700%'}}></div><br />
                                {/* <div className='load'>Loading...</div><br /> <br /><br /> */}
                            </tbody>
                        ) : (
                            <tbody>
                                {filterOptions.month || filterOptions.year || filterOptions.status ? (
                                    // Render filtered orders if any filters are applied
                                    currentEntries1.map(orderGroup => (
                                        <tr key={orderGroup[0].OrderNumber}>
                                            <td style={{ color: "indigo" }}>{orderGroup[0].OrderID}</td>
                                            <td style={{ color: "darkgreen" }}>{orderGroup[0].OrderNumber}</td>
                                            <td style={{ color: "red" }}>{orderGroup[0].OrderDate}</td>
                                            <td style={{ color: "purple" }}>{orderGroup[0].ExpectedDispatchDate}</td>
                                            <td style={{ color: "darkblue" }}>{orderGroup[0].CustomerName}</td>
                                            <td>{orderGroup[0].Address}</td>
                                            <td>{orderGroup[0].Color}</td>
                                            <td>
                                                {orderGroup[0].OrderStatus === 'Delivered' ? (
                                                    <div className="order-status delivered">
                                                        <CheckCircle className="success-icon" />
                                                        Delivered
                                                    </div>
                                                ) : orderGroup[0].OrderStatus === 'Approved For Dispatch' ? (
                                                    <div className="order-status approved">
                                                        <span style={{ color: 'white' }}>
                                                            <CheckCircle size={16} />
                                                            Approved for Dispatch
                                                        </span>
                                                    </div>
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
                                                ) : orderGroup[0].OrderStatus === 'Job Card Issued' ? (
                                                    <div className="order-status issued1" >
                                                        <Dribbble size={16} />
                                                        Job Card Issued
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'red' }}>
                                                        <AlertCircle size={16} />
                                                        Unknown Status
                                                    </span>
                                                )}
                                            </td>
                                            <td>{orderGroup[0].DocStatus === 'O' ? 'Open' : 'Close'}</td>
                                            <td>{orderGroup[0].salesEmployeeName || 'Loading ...'}</td>
                                            <td>
                                                <button onClick={() => handleActionClick(orderGroup[0].OrderID, orderGroup)} className="action-button">View Products</button>
                                            </td>
											<td>{orderGroup[0].DocTotal}</td>
                                          
                                                {/* Replace button with icons for view details and update order */}
                                                
                                                    <div className="action-icon2" title="View Details" style={{ cursor: "pointer" }}>
                          <td>
                            <button onClick={() => handleOrderDetailsClick(orderGroup[0].OrderID)}>
                              <span>View Order</span>

                            </button>
                          </td>

                        </div>

                        <div className="action-icon2" title="Update Status" style={{ cursor: "pointer" }}>
                          <td>

                            <button onClick={() => handleStatusUpdateClick(orderGroup[0].OrderID,orderGroup[0].OrderStatus,orderGroup[0].ExpectedDispatchDate )} className="action-button">Update Status</button>
                                                    
                          </td>

                        </div>
                                                
                                        </tr>
                                    ))
                                ) : (
                                    // Render all orders if no filters are applied
                                    currentEntries.map(orderGroup => (
                                        <tr key={orderGroup[0].OrderNumber}>
                                            <td style={{ color: "indigo" }}>{orderGroup[0].OrderID}</td>
                                            <td style={{ color: "darkgreen" }}>{orderGroup[0].OrderNumber}</td>
                                            <td style={{ color: "red" }}>{orderGroup[0].OrderDate}</td>
                                            <td style={{ color: "purple" }}>{orderGroup[0].ExpectedDispatchDate}</td>
                                            <td style={{ color: "darkblue" }}>{orderGroup[0].CustomerName}</td>
                                            <td>{orderGroup[0].Address}</td>
                                            <td>{orderGroup[0].Color}</td>
                                            <td>
                                                {orderGroup[0].OrderStatus === 'Delivered' ? (
                                                    <div className="order-status delivered">
                                                        <CheckCircle className="success-icon" />
                                                        Delivered
                                                    </div>
                                                ) : orderGroup[0].OrderStatus === 'Approved For Dispatch' ? (
                                                    <div className="order-status approved">
                                                        <span style={{ color: 'white' }}>
                                                            <CheckCircle size={16} />
                                                            Approved for Dispatch
                                                        </span>
                                                    </div>
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
                                                ) : orderGroup[0].OrderStatus === 'Job Card Issued' ? (
                                                    <div className="order-status issued1" >
                                                        <Dribbble size={16} />
                                                        Job Card Issued
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'red' }}>
                                                        <AlertCircle size={16} />
                                                        Unknown Status
                                                    </span>
                                                )}
                                            </td>
                                            <td>{orderGroup[0].DocStatus === 'O' ? 'Open' : 'Close'}</td>
                                            <td>{orderGroup[0].salesEmployeeName || 'Loading ...'}</td>
                                            <td>
                                                <button onClick={() => handleActionClick(orderGroup[0].OrderID, orderGroup)} className="action-button">View Products</button>
                                            </td>
											<td>₹ {orderGroup[0].DocTotal}</td>
                                            <td>
                                                {/* Replace button with icons for view details and update order */}
                                                <div className="action-icons2">
                                                <div className="action-icon2" title="View Details" style={{ cursor: "pointer" }}>
                                                
                                                    <button onClick={() => handleOrderDetailsClick(orderGroup[0].OrderID)}>
                                                    <span>View Order</span>

                                                    </button>

                                                </div>
                                                    <div className="action-icon2" title="Update Status" style={{ cursor: "pointer" }}>
                                                        <button onClick={() => handleStatusUpdateClick(orderGroup[0].OrderID,orderGroup[0].OrderStatus,orderGroup[0].ExpectedDispatchDate)} className="action-button">Update Status</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        )}
                    </table>
                    {filterOptions.month || filterOptions.year || filterOptions.status ? (
                        <div>
                            {/* Pagination */}
                            <div className="pagination">
                                {/* Prev button */}
                                <button
                                    onClick={() => setCurrentPage1(currentPage1 - 1)}
                                    disabled={currentPage1 === 1}
                                    className="pagination-button"
                                >
                                    Prev
                                </button>
                                {/* Page numbers */}
                                <div className="page-numbers">
                                    {[...Array(Math.ceil(FilteredOrders1.length / entriesPerPage)).keys()].map(number => (
                                        <button
                                            key={number + 1}
                                            onClick={() => setCurrentPage1(number + 1)}
                                            className={currentPage1 === number + 1 ? 'active page-button' : 'page-button'}
                                        >
                                            {number + 1}
                                        </button>
                                    ))}
                                </div>
                                {/* Next button */}
                                <button
                                    onClick={() => setCurrentPage1(currentPage1 + 1)}
                                    disabled={currentPage1 === Math.ceil(FilteredOrders1.length / entriesPerPage)}
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div>
                            {/* Pagination */}
                            <div className="pagination">
                                {/* Prev button */}
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    Prev
                                </button>
                                {/* Page numbers */}
                                <div className="page-numbers">
                                    {[...Array(Math.ceil(FilteredOrders.length / entriesPerPage)).keys()].map(number => (
                                        <button
                                            key={number + 1}
                                            onClick={() => setCurrentPage(number + 1)}
                                            className={currentPage === number + 1 ? 'active page-button' : 'page-button'}
                                        >
                                            {number + 1}
                                        </button>
                                    ))}
                                </div>
                                {/* Next button */}
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(FilteredOrders.length / entriesPerPage)}
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                            </div>


                        </div>
                    )}

                </div>

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
                    orderNumber={selectedOrderItems[0]?.OrderNumber}
                    dispatchDate={expDate} // Pass order number as prop
                />
            )}



            <ToastContainer />
        </>
    );
};

export default AllOrders;
