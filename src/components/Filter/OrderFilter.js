import React, { useState } from 'react';
import './OrderFilter.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderFilter = ({ handleFilter, closeModal }) => {
    const [filterOptions, setFilterOptions] = useState({
        month: '',
        year: '',
        status: '',
        docstatus : ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions({ ...filterOptions, [name]: value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal(); // Close modal on form submission
        toast.success("Filter Applied Successfully"); // Show success message
        handleFilter(filterOptions); // Apply filter
    };

    // Generate an array of years from 2022 to 2024
    const years = Array.from({ length: 3 }, (_, index) => 2022 + index);

    return (
        <div className="order-filter-popover">
            <form onSubmit={handleSubmit} className="order-filter-form">
                <label htmlFor="month" className="order-filter-label">Month:</label>
                <select
                    id="month"
                    name="month"
                    value={filterOptions.month}
                    onChange={handleChange}
                    className="order-filter-select"
                >
                    <option value="">Select Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <label htmlFor="year" className="order-filter-label">Year:</label>
                <select
                    id="year"
                    name="year"
                    value={filterOptions.year}
                    onChange={handleChange}
                    className="order-filter-select"
                >
                    <option value="">Select Year</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <label htmlFor="status" className="order-filter-label">Status:</label>
                <select
                    id="status"
                    name="status"
                    value={filterOptions.status}
                    onChange={handleChange}
                    className="order-filter-select"
                >
                    <option value="">All</option>
                    <option value="Ready For Dispatch">Ready for Dispatch</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Job Card Issued">Job Card Issued</option>
                    <option value="Approved For Dispatch">Approved For Dispatch</option>
                    <option value="Delivered">Delivered</option>
                    <option value="null">Unknown status</option>
                </select>
                {/* <label htmlFor="docstatus" className="order-filter-label">Doc Status:</label>
                <select
                    id="docstatus"
                    name="docstatus"
                    value={filterOptions.docstatus}
                    onChange={handleChange}
                    className="order-filter-select"
                >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="Close">Close</option>
                </select> */}
                <button type="submit" className="order-filter-button"  onClick={handleSubmit}>Apply Filter</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default OrderFilter;
