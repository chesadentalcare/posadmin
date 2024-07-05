import React, { useState, useEffect } from 'react';
import { ExternalLink, X } from 'react-feather';
import Sidebar from '../../Sidebar/Sidebar';
import '../../Dashboard/Allorders.css'
import Modal from '../../Products/Modal';
import LoadingAnimation from '../../Loading/Loading';
import { CheckCircle, AlertCircle, Dribbble, XCircle, Clock, Eye, Edit } from 'react-feather';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalWrapper from '../../Filter/ModalWrapper';
import StatusUpdateModal from '../../Products/StatusUpdateModal'; // Import StatusUpdateModal
import { CheckCircleFill } from 'react-bootstrap-icons';
import DCCreationModal from '../../DcCreation/DCCreationModal ';
import { useSidebar } from '../../../ContextAPI/SidebarContext';

const ReadyForDispatch = () => {
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
    const [orderByOrderDate, setOrderByOrderDate] = useState(null); // State for sorting Order Date
    const [orderByDispatchDate, setOrderByDispatchDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
    const [isDCCreationModalOpen, setIsDCCreationModalOpen] = useState(false);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://api.chesadentalcare.com/ready_for_dispatch');
                const data = await response.json();
                setOrders(data);
                setIsLoading(false);
                // Call the function to fetch sales employee names
                fetchSalesEmployeeNames(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    const fetchSalesEmployeeNames = async (data) => {
        setIsLoading(false);
        // Iterate through each order
        for (const order of data) {
            // Check if SalesEmp is a valid value before making the fetch request
            if (order.SalesEmp) {
                try {
                    const response = await fetch(`https://api.chesadentalcare.com/shipped_orders/${order.SalesEmp}`);
                    const salesEmployeeData = await response.json();
                    // Update the specific order with sales employee name
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



    const handleOrderDetailsClick = (orderId, orderNumber) => {
        setSelectedOrderId(orderId);
        setSelectedOrderNumber(orderNumber);
        setIsDCCreationModalOpen(true);
    };

    const handleCloseDCCreationModal = () => {
        setIsDCCreationModalOpen(false);
    };

    const handleCreateDC = (serialNumber) => {
        // Logic to create DC goes here
        console.log(`DC created for Order ${selectedOrderNumber} with serial number ${serialNumber}`);
        setIsDCCreationModalOpen(false);
    }



    const handleStatusUpdateClick = (orderId) => {
        setSelectedOrderId(orderId);
        setIsStatusUpdateModalOpen(true);
    };



    const handleFilter = (filterOptions) => {
        // Implement filter logic here
        console.log('Filter options:', filterOptions);
    };

    const handleActionClick = (orderId, orderItems) => {
        setSelectedOrderId(orderId);
        setSelectedOrderItems(orderItems);
        setIsModalOpen(true);
    };

    const handleViewClick = (orderId) => {
        toast.success("Action button clicked")
        setSelectedOrderId(orderId);
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown menu
    };


    const handleUpdateOrderClick = () => {
        // Handle update order click
        console.log('Update order clicked for order ID:', selectedOrderId);
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
        return acc;
    }, {});

    const groupedOrdersArray = Object.values(groupedOrders);

    const filteredOrders = groupedOrdersArray.filter(orderGroup =>
        orderGroup.some(order => order.OrderNumber.toString().includes(searchTerm.toString()))
    );

    const sortedOrders = orderByOrderDate
        ? sortOrders(filteredOrders, 'OrderDate', orderByOrderDate)
        : orderByDispatchDate
            ? sortOrders(filteredOrders, 'ExpectedDispatchDate', orderByDispatchDate)
            : filteredOrders;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = sortedOrders.slice(indexOfFirstEntry, indexOfLastEntry);

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
                    <h1 className="company-name1">READY FOR DISPATCH</h1><br />
                    <div style={{ position: "relative", right: "5%" }}>
                        {/* <ModalWrapper /> */}
                    </div>

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
                                <th>Action</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <tbody><br /> <br /> <br /><br />
                                <div class="loader21" style={{position : 'relative', left: '700%'}}></div><br />
                                {/* <div className='load'>Loading...</div><br /> <br /><br /> */}
                            </tbody>
                        ) : filteredOrders.length === 0 ? (
                            // Display image when no orders found
                            <tbody>
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center", paddingTop: "50px" }}>
                                        <div className="no-orders-container">
                                            <img src={require("./data.png")} alt="No Orders Found" className="no-orders-image" />
                                            {/* <p className="no-orders-text">No orders found</p> */}
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


                                        <td>{orderGroup[0].DocStatus}</td>
                                        {/* Sales employee name without loading animation */}
                                        <td>{orderGroup[0].salesEmployeeName || 'Loading ...'}</td>
                                        <td>
                                            <button onClick={() => handleActionClick(orderGroup[0].OrderID, orderGroup)} className="action-button">View Products</button>
                                        </td>
                                        <td>
                                            {/* Replace button with icons for view details and update order */}
                                            <div className="action-icons2">
                                                <div className="action-icon2" title="DC creation" style={{ cursor: "pointer" }}>
                                                    <td>
                                                        <button onClick={() => handleOrderDetailsClick(orderGroup[0].OrderID, orderGroup[0].OrderNumber)} className="action-button">DC creation</button>
                                                    </td>

                                                </div>

                                                <div className="action-icon2" title="Update Status" style={{ cursor: "pointer" }}>
                                                    <td>
                                                        <button onClick={() => handleStatusUpdateClick(orderGroup[0].OrderID, orderGroup[0].OrderStatus)} className="action-button">Update Status</button>
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
                    orderNumber={selectedOrderItems[0]?.OrderNumber} // Pass order number as prop
                />
            )}

            {isDCCreationModalOpen && (
                <DCCreationModal
                    orderId={selectedOrderId}
                    orderNumber={selectedOrderNumber}
                    onClose={handleCloseDCCreationModal}
                    onCreateDC={handleCreateDC}
                />
            )}
            <ToastContainer />
        </>
    );
};

export default ReadyForDispatch;
