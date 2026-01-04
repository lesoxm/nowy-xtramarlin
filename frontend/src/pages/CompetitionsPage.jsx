import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { competitionsAPI } from '../utils/api';
import '../styles/CompetitionsPage.css';

function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchCompetitions();
  }, [filter]);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? null : filter;
      const response = await competitionsAPI.getAll(status);
      setCompetitions(response.data);
    } catch (error) {
      console.error('Failed to fetch competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: 'Nadchodzące',
      active: 'Trwa',
      completed: 'Zakończone'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    return `competition-status ${status}`;
  };

  return (
    <div className="competitions-page">
      <div className="page-header">
        <h1>Zawody Wędkarskie</h1>
        {user && user.role === 'organizer' && (
          <Link to="/dashboard?tab=create" className="btn btn-primary">
            + Utwórz Zawody
          </Link>
        )}
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Wszystkie
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Aktywne
        </button>
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Nadchodzące
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Zakończone
        </button>
      </div>

      {loading ? (
        <div className="loading">Ładowanie zawodów...</div>
      ) : competitions.length > 0 ? (
        <div className="competitions-grid">
          {competitions.map((comp) => (
            <div key={comp.id} className="competition-card">
              <div className="card-header">
                <h3>{comp.name}</h3>
                <span className={getStatusClass(comp.status)}>
                  {getStatusLabel(comp.status)}
                </span>
              </div>
              
              <p className="competition-description">{comp.description}</p>
              
              <div className="competition-info">
                <div className="info-item">
                  <span className="info-label">Organizator:</span>
                  <span className="info-value">{comp.organizer_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Start:</span>
                  <span className="info-value">
                    {new Date(comp.start_date).toLocaleDateString('pl-PL', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Koniec:</span>
                  <span className="info-value">
                    {new Date(comp.end_date).toLocaleDateString('pl-PL', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <Link
                  to={`/competitions/${comp.id}`}
                  className="btn btn-secondary btn-small"
                >
                  Szczegóły
                </Link>
                {comp.status === 'active' && (
                  <Link
                    to={`/competitions/${comp.id}/live`}
                    className="btn btn-primary btn-small"
                  >
                    🔴 Live
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>Brak zawodów w wybranej kategorii</p>
        </div>
      )}
    </div>
  );
}

export default CompetitionsPage;
