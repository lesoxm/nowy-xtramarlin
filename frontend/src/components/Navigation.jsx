import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Navigation.css';

function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          🎣 xTraMarlin
        </Link>

        <div className="nav-links">
          <Link to="/competitions" className="nav-link">
            Zawody
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Panel
              </Link>
              <span className="user-info">
                {user.username} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Zaloguj
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
