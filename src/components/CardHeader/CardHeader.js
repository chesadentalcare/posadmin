import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './cardheader.css';

const CardHeader = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
	const [pktotalOrders, pksetTotalOrders] = useState(0);
    const [pktotalPrice, pksetTotalPrice] = useState(0);
	const [rfdtotalOrders, rfdsetTotalOrders] = useState(0);
    const [rfdtotalPrice, rfdsetTotalPrice] = useState(0);
	const [sptotalOrders, spsetTotalOrders] = useState(0);
    const [sptotalPrice, spsetTotalPrice] = useState(0);
	const [afdtotalOrders, afdsetTotalOrders] = useState(0);
    const [afdtotalPrice, afdsetTotalPrice] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://api.chesadentalcare.com/open_orders');

            const data = response.data;
            console.log("maindata", data);

            // Create a map to store unique orders and their total prices
            const orderMap = new Map();

            data.forEach(order => {
                if (orderMap.has(order.OrderID)) {
                    // If the order is already in the map, add the LineTotal to the existing value
                    orderMap.set(order.OrderID, orderMap.get(order.OrderID) + order.LineTotal);
                } else {
                    // If the order is not in the map, add it with its LineTotal
                    orderMap.set(order.OrderID, order.LineTotal);
                }
            });

            // Get the unique orders count
            const totalOrders = orderMap.size;

            // Calculate the total price of all unique orders
            const totalPrice = Array.from(orderMap.values()).reduce((sum, price) => sum + price, 0);

            setTotalPrice(totalPrice.toFixed(2));
            setTotalOrders(totalOrders); // Assuming you have a state for this

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setIsLoading(false);
            setError('Failed to fetch orders. Please try again later.');
        }
    };

    fetchOrders();
}, []);



useEffect(() => {
    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://api.chesadentalcare.com/pick_list');

            const data = response.data;
            console.log("maindata", data);

            // Create a map to store unique orders and their total prices
            const orderMap = new Map();

            data.forEach(order => {
                if (orderMap.has(order.OrderID)) {
                    // If the order is already in the map, add the LineTotal to the existing value
                    orderMap.set(order.OrderID, orderMap.get(order.OrderID) + order.LineTotal);
                } else {
                    // If the order is not in the map, add it with its LineTotal
                    orderMap.set(order.OrderID, order.LineTotal);
                }
            });

            // Get the unique orders count
            const totalOrders = orderMap.size;

            // Calculate the total price of all unique orders
            const totalPrice = Array.from(orderMap.values()).reduce((sum, price) => sum + price, 0);

            pksetTotalPrice(totalPrice.toFixed(2));
            pksetTotalOrders(totalOrders); // Assuming you have a state for this

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setIsLoading(false);
            setError('Failed to fetch orders. Please try again later.');
        }
    };

    fetchOrders();
}, []);



useEffect(() => {
    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://api.chesadentalcare.com/ready_for_dispatch');

            const data = response.data;
            console.log("maindata", data);

            // Create a map to store unique orders and their total prices
            const orderMap = new Map();

            data.forEach(order => {
                if (orderMap.has(order.OrderID)) {
                    // If the order is already in the map, add the LineTotal to the existing value
                    orderMap.set(order.OrderID, orderMap.get(order.OrderID) + order.LineTotal);
                } else {
                    // If the order is not in the map, add it with its LineTotal
                    orderMap.set(order.OrderID, order.LineTotal);
                }
            });

            // Get the unique orders count
            const totalOrders = orderMap.size;

            // Calculate the total price of all unique orders
            const totalPrice = Array.from(orderMap.values()).reduce((sum, price) => sum + price, 0);

            rfdsetTotalPrice(totalPrice.toFixed(2));
            rfdsetTotalOrders(totalOrders); // Assuming you have a state for this

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setIsLoading(false);
            setError('Failed to fetch orders. Please try again later.');
        }
    };

    fetchOrders();
}, []);


useEffect(() => {
    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://api.chesadentalcare.com/shipped_orders');

            const data = response.data;
            console.log("maindata", data);

            // Create a map to store unique orders and their total prices
            const orderMap = new Map();

            data.forEach(order => {
                if (orderMap.has(order.OrderID)) {
                    // If the order is already in the map, add the LineTotal to the existing value
                    orderMap.set(order.OrderID, orderMap.get(order.OrderID) + order.LineTotal);
                } else {
                    // If the order is not in the map, add it with its LineTotal
                    orderMap.set(order.OrderID, order.LineTotal);
                }
            });

            // Get the unique orders count
            const totalOrders = orderMap.size;

            // Calculate the total price of all unique orders
            const totalPrice = Array.from(orderMap.values()).reduce((sum, price) => sum + price, 0);

            spsetTotalPrice(totalPrice.toFixed(2));
            spsetTotalOrders(totalOrders); // Assuming you have a state for this

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setIsLoading(false);
            setError('Failed to fetch orders. Please try again later.');
        }
    };

    fetchOrders();
}, []);


useEffect(() => {
    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://api.chesadentalcare.com/approved_for_dispatch');

            const data = response.data;
            console.log("maindata", data);

            // Create a map to store unique orders and their total prices
            const orderMap = new Map();

            data.forEach(order => {
                if (orderMap.has(order.OrderID)) {
                    // If the order is already in the map, add the LineTotal to the existing value
                    orderMap.set(order.OrderID, orderMap.get(order.OrderID) + order.LineTotal);
                } else {
                    // If the order is not in the map, add it with its LineTotal
                    orderMap.set(order.OrderID, order.LineTotal);
                }
            });

            // Get the unique orders count
            const totalOrders = orderMap.size;

            // Calculate the total price of all unique orders
            const totalPrice = Array.from(orderMap.values()).reduce((sum, price) => sum + price, 0);

            afdsetTotalPrice(totalPrice.toFixed(2));
            afdsetTotalOrders(totalOrders); // Assuming you have a state for this

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setIsLoading(false);
            setError('Failed to fetch orders. Please try again later.');
        }
    };

    fetchOrders();
}, []);



	


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="row" style={{ padding: '15px' }}>
                <div className="col-md-4" style={{ marginTop: '10px' }}>
                    <div className="card card-bordered" id="tooltip-container3" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.8)' }}>
                        <div className="card-body" style={{ textAlign: 'center' }}>
                            <h5 className="mt-0 font-16">Open Orders</h5>
                            <h6 className="text-primary my-3" style={{ fontSize: '35px' }}>
                                <span data-plugin="counterup">{totalOrders}</span> 
                            </h6>
                            <hr />
                            <p>Total: <b style={{ color: '#ffa353' }}> ₹ {totalPrice}</b></p>
                            <Link to="/all_orders" className="btn btn-primary">Click Here</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4" style={{ marginTop: '10px' }}>
                    <div className="card card-bordered" id="tooltip-container3" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.8)' }}>
                        <div className="card-body" style={{ textAlign: 'center' }}>
                            <h5 className="mt-0 font-16">Pick List</h5>
                            <h6 className="text-primary my-3" style={{ fontSize: '35px' }}>
                                <span data-plugin="counterup">{pktotalOrders}</span>
                            </h6>
                            <hr />
                            <p>Total: <b style={{ color: '#ffa353' }}> ₹ {pktotalPrice}</b></p>
                            <Link to="/picklist" className="btn btn-primary">Click Here</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4" style={{ marginTop: '10px' }}>
                    <div className="card card-bordered" id="tooltip-container3" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.8)' }}>
                        <div className="card-body" style={{ textAlign: 'center' }}>
                            <h5 className="mt-0 font-16">Ready for Dispatch</h5>
                            <h6 className="text-primary my-3" style={{ fontSize: '35px' }}>
                                <span data-plugin="counterup">{rfdtotalOrders}</span>
                            </h6>
                            <hr />
                            <p>Total: <b style={{ color: '#ffa353' }}> ₹ {rfdtotalPrice}</b></p>
                            <Link to="/ready-for-dispatch" className="btn btn-primary">Click Here</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4" style={{ marginTop: '10px' }}>
                    <div className="card card-bordered" id="tooltip-container3" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.8)' }}>
                        <div className="card-body" style={{ textAlign: 'center' }}>
                            <h5 className="mt-0 font-16">Approved Dispatch</h5>
                            <h6 className="text-primary my-3" style={{ fontSize: '35px' }}>
                                <span data-plugin="counterup">{afdtotalOrders}</span>
                            </h6>
                            <hr />
                            <p>Total: <b style={{ color: '#ffa353' }}> ₹ {afdtotalPrice}</b></p>
                            <Link to="/aap_dispatch_order" className="btn btn-primary">Click Here</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4" style={{ marginTop: '10px' }}>
                    <div className="card card-bordered" id="tooltip-container3" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.8)' }}>
                        <div className="card-body" style={{ textAlign: 'center' }}>
                            <h5 className="mt-0 font-16">Shipped Orders</h5>
                            <h6 className="text-primary my-3" style={{ fontSize: '35px' }}>
                                <span data-plugin="counterup">{sptotalOrders}</span>
                            </h6>
                            <hr />
                            <p>Total: <b style={{ color: '#ffa353' }}> ₹ {sptotalPrice}</b></p>
                            <Link to="/shipped_orders" className="btn btn-primary">Click Here</Link>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default CardHeader;
