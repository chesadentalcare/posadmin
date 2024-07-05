import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Import CSS file for styling
import backgroundImage from './chesa.png'; // Import the image
import { Clipboard, Truck, Box, CheckCircle, BoxArrowRight, Boxes, ChevronBarLeft, ChevronBarRight } from 'react-bootstrap-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSidebar } from '../../ContextAPI/SidebarContext';
import { useAuth } from '../../ContextAPI/AuthContext';


const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { logout } = useAuth();

  
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    toast.error("Logout Successful");
  };
  
  return (
    <>
      <div className={`sidebar1 ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header2">
          <img src={backgroundImage} alt="Company Logo" className="company-logo1" />
        </div>
        <div className="sidebar-header1">
          <h2 className="company-name">Chesa Dental Care</h2><br />
        </div>

        <ul className="sidebar-options1">
          <li className={`sidebar-option1 ${location.pathname === '/all_orders' ? 'active' : ''}`}>
            <Link to="/all_orders">
              <Clipboard className="icon" />
              <span
                className="text"
                style={{ color: '#BFB1AE' }}
                onMouseOver={(e) => e.target.style.color = '#ffa353'}
                onMouseOut={(e) => e.target.style.color = '#BFB1AE'}
              >Open Orders</span>
            </Link>
          </li>
          <li className={`sidebar-option1 ${location.pathname === '/picklist' ? 'active' : ''}`}>
            <Link to="/picklist">
              <Clipboard className="icon" />
              <span
                className="text"
                style={{ color: '#BFB1AE' }}
                onMouseOver={(e) => e.target.style.color = '#ffa353'}
                onMouseOut={(e) => e.target.style.color = '#BFB1AE'}
              >Pick List</span>
            </Link>
          </li>
          <li className={`sidebar-option1 ${location.pathname === '/ready-for-dispatch' ? 'active' : ''}`}>
            <Link to="/ready-for-dispatch">
              <Truck className="icon" />
              <span
                className="text"
                style={{ color: '#BFB1AE' }}
                onMouseOver={(e) => e.target.style.color = '#ffa353'}
                onMouseOut={(e) => e.target.style.color = '#BFB1AE'}
              >Ready for Dispatch</span>
            </Link>
          </li>
		  <li className={`sidebar-option1 ${location.pathname === '/approved_for_dispatch' ? 'active' : ''}`}>
            <Link to="/approved_for_dispatch">
              <Truck className="icon" />
              <span
                className="text"
                style={{ color: '#BFB1AE' }}
                onMouseOver={(e) => e.target.style.color = '#ffa353'}
                onMouseOut={(e) => e.target.style.color = '#BFB1AE'}
              >Approved for Dispatch</span>
            </Link>
          </li>
          <li className={`sidebar-option1 ${location.pathname === '/shipped_orders' ? 'active' : ''}`}>
            <Link to="/shipped_orders">
              <Box className="icon" />
              <span
                className="text"
                style={{ color: '#BFB1AE' }}
                onMouseOver={(e) => e.target.style.color = '#ffa353'}
                onMouseOut={(e) => e.target.style.color = '#BFB1AE'}
              >Shipped Orders</span>
            </Link>
          </li>
          
        </ul>
        
        <Link to="/" className="logout" onClick={handleLogout}>
          <BoxArrowRight className="logout-icon" />
          {' '}Logout
        </Link>
        <div className="sidebar-footer">
          <p style={{ color: 'wheat' }}>&copy; Chesa Dental Care Production Dashboard</p>
        </div>
        
        
        
        <ToastContainer />
      </div>
      <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarOpen ? <ChevronBarLeft /> : <ChevronBarRight />}
        </button>

       
    </>
  );
};

export default Sidebar;
