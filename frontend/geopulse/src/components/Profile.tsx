import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Profile = () => {
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await axios.get('/user/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {profileData.username}</p>
      <p><strong>Email:</strong> {profileData.email}</p>
      <p><strong>First Name:</strong> {profileData.first_name}</p>
      <p><strong>Last Name:</strong> {profileData.last_name}</p>
      <p><strong>Last Login:</strong> {profileData.last_login || "Not available"}</p>
    </div>
  );
};

export default Profile;
