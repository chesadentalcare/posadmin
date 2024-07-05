import React, { useState, useEffect } from 'react';
import './Release_order.css';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { FaSyncAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSidebar } from '../../ContextAPI/SidebarContext';

const ReleaseOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
const [serialNumber, setSerialNumber] = useState('');
const [selectedProductionOrder, setSelectedProductionOrder] = useState(null);
  const { isSidebarOpen } = useSidebar();
  const [absoluteEntry, setAbsoluteEntry] = useState([]);
  const [receiptFromProduction, setReceiptFromProduction] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchedAbsoluteEntries, setFetchedAbsoluteEntries] = useState([]);

  const location = useLocation();
  const order = location.state.orderWithItem;

  const openModal = (productionOrder) => {
    setSelectedProductionOrder(productionOrder);
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
    setSerialNumber('');
  };

  
  const handleSaveSerialNumber = async (serialNumber, selectedProductionOrder) => {
    console.log(`serial_number: ${serialNumber}, PO_number: ${selectedProductionOrder}`)
    try {
      const savePromise = fetch('https://api.chesadentalcare.com/serial_number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial_number: serialNumber,
          PO_number: `${selectedProductionOrder}`
        }),        
      });
  
      toast.promise(
        savePromise,
        {
          loading: 'Saving serial number...',
          success: 'Serial number saved successfully',
          error: 'Failed to save serial number',
        }
      );
  
      const response = await savePromise;
  
      if (!response.ok) {
        throw new Error('Failed to save serial number');
      }
  
      // Perform necessary actions after successful save
      console.log('Serial number saved successfully');
      closeModal();
    } catch (error) {
      console.error('Error saving serial number:', error.message);
      toast.error('Failed to save serial number');
    }
  };
  
  const saveSerialNumber = () => {
    // console.log(selectedProductionOrder)
    if (!serialNumber || !selectedProductionOrder || !selectedProductionOrder) {
      console.error('Missing required data');
      toast.error('Missing required data');
      return;
    }
    handleSaveSerialNumber(serialNumber, selectedProductionOrder);

  };
  

  useEffect(() => {
    fetchAbsoluteEntry();
  }, [order.OrderNumber]);

  useEffect(() => {
    if (absoluteEntry.length > 0) {
      handleFetchProductionOrder(absoluteEntry);
    }
  }, [absoluteEntry]);

  const fetchAbsoluteEntry = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.chesadentalcare.com/orders_so/${order.OrderNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch AbsoluteEntry');
      }
      const data = await response.json();
      setAbsoluteEntry(data);
      setError('');
    } catch (error) {
      console.error('Error fetching AbsoluteEntry:', error.message);
      setError('No Production Orders Found for this Sales Order');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseNow = async (AbsoluteEntry) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.chesadentalcare.com/release_order/${AbsoluteEntry}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to release production order');
      }
      console.log('Production order released successfully');

      const updatedOrders = productionOrders.map((order) => {
        if (order.AbsoluteEntry === AbsoluteEntry) {
          return { ...order, Status: 'Released', updatedDueDate: undefined };
        }
        return order;
      });
      setProductionOrders(updatedOrders);
      setError('');
    } catch (error) {
      console.error('Error releasing production order:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDueDate = async (AbsoluteEntry, updatedDueDate) => {
    try {
      setLoading(true);

      const patchResponse = await fetch(
        `https://api.chesadentalcare.com/production_orders`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: AbsoluteEntry,
            DueDate: updatedDueDate,
          }),
        }
      );
      if (!patchResponse.ok) {
        throw new Error('Failed to update due date');
      }
      console.log('Due date updated successfully');

      const updatedOrders = productionOrders.map((order) => {
        if (order.AbsoluteEntry === AbsoluteEntry) {
          return {
            ...order,
            DueDate: updatedDueDate,
            isEditing: false,
          };
        }
        return order;
      });
      setProductionOrders(updatedOrders);

      setError('');
    } catch (error) {
      console.error('Error updating due date:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchProductionOrder = async (absoluteEntries) => {
    try {
      setLoading(true);
      const entriesToFetch = absoluteEntries.filter(entry => !fetchedAbsoluteEntries.includes(entry));
      if (entriesToFetch.length === 0) {
        setLoading(false);
        return;
      }
      const promises = entriesToFetch.map(entry =>
        fetch(`https://api.chesadentalcare.com/prod_orders?id=${entry}`)
      );
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(response => response.json()));

      setFetchedAbsoluteEntries(prevEntries => [...prevEntries, ...data.map(entry => entry.AbsoluteEntry)]);

      const newData = data.filter(entry => !productionOrders.some(existingEntry => existingEntry.AbsoluteEntry === entry.AbsoluteEntry));
      setProductionOrders(prevOrders => [...prevOrders, ...newData]);
      setError('');
    } catch (error) {
      console.error('Error fetching production order details:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostProductionOrder = (itemNo, plannedQuantity, salesOrderDueDate, salesOrderID, salesOrderNumber) => {
    try {
      const currentDate = new Date();
      const postingDate = currentDate.toISOString();

      const salesOrderDueDateComponents = salesOrderDueDate.split('-');
      const salesOrderDueDateObj = new Date(`${salesOrderDueDateComponents[2]}-${salesOrderDueDateComponents[1]}-${salesOrderDueDateComponents[0]}`);
      let dueDate;

      if (salesOrderDueDateObj < currentDate) {
        dueDate = new Date(currentDate);
        dueDate.setDate(dueDate.getDate() + 2);
      } else {
        dueDate = new Date(salesOrderDueDateObj);
        dueDate.setDate(dueDate.getDate() - 2);
      }

      if (isNaN(dueDate.getTime())) {
        throw new Error('Invalid due date');
      }

      const formattedDueDate = dueDate.toISOString();

      const postOrderPromise = new Promise(async (resolve, reject) => {
        try {
          const confirmedQuantity = prompt(`Please confirm the quantity for item ${itemNo}:`, plannedQuantity);
          if (confirmedQuantity === null) {
            reject(new Error('Posting cancelled'));
            return;
          }
          const quantity = parseFloat(confirmedQuantity);

          const response = await fetch(`https://api.chesadentalcare.com/production_orders`, {
            method: 'POST',
            body: JSON.stringify({
              ItemNo: itemNo,
              PlannedQuantity: quantity,
              PostingDate: postingDate,
              DueDate: formattedDueDate
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to post production order');
          }

          const productionOrderData = await response.json();
          const additionalDataResponse = await fetch(`https://api.chesadentalcare.com/production`, {
            method: 'POST',
            body: JSON.stringify({
              PO_Entry: productionOrderData.AbsoluteEntry.toString(),
              PO_number: productionOrderData.DocumentNumber,
              SalesOrder_ID: salesOrderID.toString(),
              SalesOrder_number: salesOrderNumber
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!additionalDataResponse.ok) {
            const data = await additionalDataResponse.json();
            throw new Error(data.message || 'Failed to post additional data');
          }

          resolve('Production order posted successfully');
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(
        postOrderPromise, {
        loading: 'Posting production order...',
        success: (message) => `Success: ${message}`,
        error: (error) => `Error: ${error.message}`,
      }
      );
    } catch (error) {
      console.error('Error in handlePostProductionOrder:', error);
      toast.error('An error occurred while posting production order');
    }
  };

  const refreshProductionOrders = async () => {
    toast.promise(
      fetchAbsoluteEntry().then(() => {
        if (absoluteEntry.length > 0) {
          return handleFetchProductionOrder(absoluteEntry);
        }
      }),
      {
        loading: 'Refreshing production orders...',
        success: 'Production orders refreshed successfully!',
        error: 'Error refreshing production orders. Please try again.',
      }
    );
  };

  const fetchShortShipment = async (productionOrderNumber) => {
    try {
      const response = await fetch(`https://api.chesadentalcare.com/short_shipment/${productionOrderNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch short shipment data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching short shipment data:', error.message);
      return null;
    }
  };

  const fetchReceiptFromProduction = async () => {
    try {
      const salesOrderNumber = order.OrderNumber; // Assuming sales order number is available in the order object
      const response = await fetch(`https://api.chesadentalcare.com/short_shipment/${salesOrderNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch receipt from production orders');
      }
  
      const shortShipmentData = await response.json();
  
      const newReceiptData = productionOrders.reduce((acc, productionOrder) => {
        const shortShipment = shortShipmentData.find(item => item.PO_Entry === productionOrder.AbsoluteEntry);
  
        if (shortShipment && (shortShipment.short_shipment === 'yes' || shortShipment.short_shipment === 'no')) {
          const existingOrder = acc.find(order => order.DocumentNumber === productionOrder.DocumentNumber);
  
          if (!existingOrder) {
            acc.push({ ...productionOrder, shortShipment: shortShipment.short_shipment });
          }
        }
  
        return acc;
      }, []);
  
      setReceiptFromProduction(newReceiptData);
      setError('');
    } catch (error) {
      console.error('Error fetching receipt from production orders:', error.message);
      setError('Failed to fetch receipt from production orders');
    } finally {
      // setLoading(false);
    }
  };
  
  
  

 



  const handleRefreshReceiptFromProduction = async () => {
    toast.promise(
      fetchReceiptFromProduction(), {
      loading: 'Refreshing receipt from production orders...',
      success: 'Receipt from production orders refreshed successfully!',
      error: 'Error refreshing receipt from production orders. Please try again.',
    });
  };
  return (
    <>
      <div className={`production-orders ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ backgroundColor: 'rgba(242, 242, 242, 1.97)' }}>
        <Sidebar />
        <h1 className='hi1'>ORDER DETAILS</h1>
        <div className="release-order-page">
          <div className="order-details">
            <h2> Sales Order Details</h2>
            <p><strong>Customer Name:</strong> {order.CustomerName}</p>
            <p><strong>Address:</strong> {order.Address}</p>
            <p><strong>Order Number:</strong> {order.OrderNumber}</p>
          </div>

          <div className="item-details">
            <h2>Item Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Item Code</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                  <th>Due Date </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ItemDescription}</td>
                    <td>{item.ItemCode}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.OrderDate}</td>
                    <td>
                      {item.ExpectedDispatchDate}
                    </td>
                    <td>
                      <button onClick={() => handlePostProductionOrder(
                        item.ItemCode,
                        item.Quantity,
                        item.ExpectedDispatchDate,
                        item.OrderID,
                        item.OrderNumber
                      )}>Post Production Order</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="production-order-details">
            <h2>Production Order Details <span style={{ color: 'green' }}> ( Due dates with Green colour can be updated )</span> </h2>
            <button className='btn11' onClick={refreshProductionOrders} style={{ marginLeft: '10px' }}>
              <FaSyncAlt />
            </button>
            {loading && <p className="loader"></p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && productionOrders.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>SAP entry</th>
                    <th>Production Order ID</th>
                    <th>Item Code</th>
                    <th>Warehouse ID</th>
                    <th>Planned Quantity</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productionOrders
                    .filter((order, index, self) =>
                      index === self.findIndex((t) => (
                        t.AbsoluteEntry === order.AbsoluteEntry
                      ))
                    )
                    .map((productionOrder, index) => (
                      <tr key={index}>
                        <td>{productionOrder.AbsoluteEntry}</td>
                        <td>{productionOrder.DocumentNumber}</td>
                        <td>{productionOrder.ItemNo}</td>
                        <td>{productionOrder.Warehouse}</td>
                        <td>{productionOrder.PlannedQuantity}</td>
                        <td>{productionOrder.Status}</td>
                        <td>{productionOrder.PostingDate}</td>
                        <td>
                          {productionOrder.Status === 'Planned' ? (
                            productionOrder.isEditing ? (
                              <>
                                <input
                                  type="date"
                                  value={productionOrder.updatedDueDate || productionOrder.DueDate}
                                  onChange={(e) => {
                                    const updatedOrders = productionOrders.map((order) => {
                                      if (order.AbsoluteEntry === productionOrder.AbsoluteEntry) {
                                        return { ...order, updatedDueDate: e.target.value };
                                      }
                                      return order;
                                    });
                                    setProductionOrders(updatedOrders);
                                  }}
                                />
                                <button
                                  className="update-button"
                                  onClick={() => {
                                    // Show confirmation dialog before updating
                                    if (window.confirm("Are you sure you want to update the due date?")) {
                                      // Call function to update due date
                                      handleUpdateDueDate(productionOrder.AbsoluteEntry, productionOrder.updatedDueDate);
                                    }
                                  }}
                                >
                                  Update
                                </button>
                              </>
                            ) : (
                              <span
                                onClick={() => {
                                  const updatedOrders = productionOrders.map((order) => {
                                    if (order.AbsoluteEntry === productionOrder.AbsoluteEntry) {
                                      return { ...order, isEditing: true };
                                    }
                                    return { ...order, isEditing: false };
                                  });
                                  setProductionOrders(updatedOrders);
                                }}
                                style={{ cursor: 'pointer', color: 'green' }}
                              >
                                {productionOrder.DueDate}
                              </span>
                            )
                          ) : (
                            productionOrder.DueDate
                          )}
                        </td>
                        <td>
                          {productionOrder.Status === 'Planned' && (
                            <button
                              className="release-button"
                              onClick={() => handleReleaseNow(productionOrder.AbsoluteEntry)}
                            >
                              Release for Production
                            </button>
                          )}
                          {productionOrder.Status === 'Released' && (
                            <p>Released</p>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="receipt-from-production">
          <h2>Receipt from Production Orders</h2>
          <button className='btn11' onClick={handleRefreshReceiptFromProduction} style={{ marginLeft: '10px' }}>
            <FaSyncAlt />
          </button>
          {!loading && receiptFromProduction.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>SAP entry</th>
                  <th>Production Order ID</th>
                  <th>Item Code</th>
                  <th>Warehouse ID</th>
                  <th>Planned Quantity</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Due Date</th>
                  <th>Short Shipment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {receiptFromProduction.map((productionOrder, index) => (
                  <tr key={productionOrder.AbsoluteEntry}> {/* Use a unique identifier */}
                    <td>{productionOrder.AbsoluteEntry}</td>
                    <td>{productionOrder.DocumentNumber}</td>
                    <td>{productionOrder.ItemNo}</td>
                    <td>{productionOrder.Warehouse}</td>
                    <td>{productionOrder.PlannedQuantity}</td>
                    <td>{productionOrder.Status}</td>
                    <td>{productionOrder.PostingDate}</td>
                    <td>{productionOrder.DueDate}</td>
                    <td>{productionOrder.shortShipment}</td>
                    <td><button onClick={() => openModal(productionOrder.DocumentNumber)}>Receipt from Production</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Receipt from Production</h2>
              <label>
                Serial Number:
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  style={{width: '60%'}}
                />
              </label>
              <div className="modal-actions">
              <button onClick={saveSerialNumber} disabled={loading}> SAVE </button>
              <button onClick={() => closeModal()}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ReleaseOrder;

