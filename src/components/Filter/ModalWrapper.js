import React, { useState } from 'react';
import Modal from 'react-modal';
import { Dropbox } from 'react-bootstrap-icons';
import OrderFilter from './OrderFilter';
import './OrderFilter.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalWrapper = ({ handleFilter }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <button className="filter-button" onClick={openModal}>
                <Dropbox size={20} className="filter-icon" />
                Filter
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Filter Orders Modal"
                className="order-filter-modal"
                overlayClassName="modal-overlay"
            >
                <button className="close-button" onClick={closeModal}>Close</button>
                <OrderFilter handleFilter={handleFilter} closeModal={closeModal} />
                <ToastContainer />
            </Modal>
        </div>
    );
};

export default ModalWrapper;
