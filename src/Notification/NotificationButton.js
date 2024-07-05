import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClose } from '@fortawesome/free-solid-svg-icons';
import './Notification.css'; // Import custom CSS for styling

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://api.chesadentalcare.com/mysql_notification');
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter(notification => notification.status === 'not_read');
        setUnreadCount(unread.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
        // Send PATCH request to mark notification as read
        const response = await axios.patch('https://api.chesadentalcare.com/mysql_notification', { id: id, read: true });

        console.log(response);
        if (response.data.success === true) {
            const updatedNotifications = notifications.map(notification =>
                notification.id === id ? { ...notification, status: 'read' } : notification
            );
            setNotifications(updatedNotifications);

            // Update unread count
            const unread = updatedNotifications.filter(notification => notification.status === 'not_read');
            setUnreadCount(unread.length);
        } else {
            console.error('Error marking notification as read: Request was not successful');
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

  
  

  return (
    <div className="notification-container">
      <button className="entry" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit" onClick={() => setShowModal(false)}> <FontAwesomeIcon icon={faClose} /></button>
            <h2>Notifications</h2>
            ...
            ...
<ul className="notification-list">
  {/* Render unread notifications */}
  {notifications
    .filter(notification => notification.status === 'not_read')
    .map(notification => (
      <li key={notification.id} className={`notification-item${notification.status === 'read' ? ' read' : ''}`}>
        <div className="notification-content">
          The sales order <strong>{notification.SalesOrder_number}</strong> has been created a production order with Production order number <strong>{notification.PO_number}</strong> and Production order id <strong>{notification.PO_Entry}</strong>
        </div>
        <div className="notification-actions">
          {notification.status === 'not_read' && <button className="read-button" onClick={() => markAsRead(notification.id)}>Mark as Read</button>}
        </div>
      </li>
    ))}
  
  {/* Render read notifications */}
  {notifications
    .filter(notification => notification.status === 'read')
    .map(notification => (
      <li key={notification.id} className={`notification-item${notification.status === 'read' ? ' read' : ''}`}>
        <div className="notification-content">
          The sales order <strong>{notification.SalesOrder_number}</strong> has been created a production order with Production order number <strong>{notification.PO_number}</strong> and Production order id <strong>{notification.PO_Entry}</strong>
        </div>
        <div className="notification-actions">
          {notification.status === 'not_read' && <button className="read-button" onClick={() => markAsRead(notification.id)}>Mark as Read</button>}
        </div>
      </li>
    ))}
</ul>
...

...

          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
