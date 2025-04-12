import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <AppWithNavbar />
    </Router>
  );
}

const AppWithNavbar = () => {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Only render Navbar if the current route is not '/login' */}
      {location.pathname !== '/login' && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
