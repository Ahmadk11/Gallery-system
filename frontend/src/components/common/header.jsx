import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo app-link">
            Photo Gallery
          </Link>
          
          <nav className="nav-links">
            <Link to="/" className="app-link">Gallery</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/upload" className="app-link">Upload</Link>
                <Link to="/profile" className="app-link">{user?.username || 'Profile'}</Link>
                <button onClick={handleLogout} className="btn-link app-button">Logout</button>
              </>
            ) : (
              <Link to="/auth" className="app-link">Login / Register</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;