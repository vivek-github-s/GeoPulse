import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Map from './Map';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          // Redirect to login if no token
          window.location.href = '/login';
          return;
        }

        // Fetch user data using the token
        const response = await axios.get('/user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the fetched data in the state
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading screen
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="user-card">
        <h2>Welcome, {userData?.username}!</h2>
        <p><strong>Email:</strong> {userData?.email}</p>
        <p><strong>Last Login:</strong> {userData?.last_login || 'N/A'}</p>
        <p><strong>Account Created:</strong> {userData?.date_joined || 'N/A'}</p>
      </div>

      <div className="map-section">
        <h3>Your Location</h3>
        <Map />
      </div>
    </div>
  );
};

export default Dashboard;
