import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './StatusModal.css';

const formatDateToDisplay = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
};

const formatDateToSend = (date) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
};

const StatusUpdateModal = ({ isOpen, onRequestClose, orderId, dispatchDate }) => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dispdate, setDispatchDate] = useState('');

    useEffect(() => {
        if (dispatchDate) {
            setDispatchDate(formatDateToDisplay(dispatchDate));
        }
    }, [dispatchDate]);

    const handleUpdateOrderClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('https://api.chesadentalcare.com/update-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: orderId,
                    status: selectedStatus,
                    expdate: dispdate,
                }),
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Order status updated successfully!',
                }).then(() => onRequestClose());
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to update order status. Please try again later.',
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred. Please try again later.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        onRequestClose();
    };

    return (
        <div className={isOpen ? "modal-overlay" : "modal-overlay hidden"}>
            <div className="modal">
                <span className="close" style={{ fontSize: "24px" }} onClick={handleCloseModal}>&times;</span>
                <h2>Update Order Status</h2>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="status-dropdown"
                >
                    <option value="">Select Status</option>
                    <option value="Job Card Issued">Job Card Issued</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Approved For Dispatch">Approved For Dispatch</option>
                </select>
                <input
                    type="date"
                    value={dispdate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="form-control"
                    placeholder="dd-mm-yyyy"
                    style={{ width: '100%', marginBottom: '15px' }}
                />
                <button onClick={handleUpdateOrderClick} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Status'}
                </button>
            </div>
        </div>
    );
};

export default StatusUpdateModal;
