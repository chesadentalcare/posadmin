import React, { useState, useEffect } from 'react';
import './Home.css'; // Import your CSS file for styling

function Dashboard() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch data from API and update state
    fetchData()
      .then(data => {
        setCards(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Function to fetch data from API
  const fetchData = async () => {
    // Example API endpoint
    const response = await fetch('https://example.com/api/dashboard');
    const data = await response.json();
    return data;
  };

  return (
    <div className="Dashboard">
      <h3 className="page-title">Production Head Dashboard Overview</h3>
      <p>Welcome to Chesa POS System Dashboard.</p>
      <div className="card-container">
        {cards.map((card, index) => (
          <DashboardCard key={index} title={card.title} count={card.count} link={card.link} />
        ))}
      </div>
    </div>
  );
}

function DashboardCard({ title, count, link }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="font-16">{title}</h5>
        <h6 className="text-primary my-3" style={{ fontSize: '35px' }}>
          <span data-plugin="counterup">{count}</span>
        </h6>
        <hr />
        <a href={link} className="btn btn-primary">Click Here</a>
      </div>
    </div>
  );
}

export default Dashboard;
