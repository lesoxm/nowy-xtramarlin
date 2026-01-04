import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { competitionsAPI, statisticsAPI } from '../utils/api';
import '../styles/HomePage.css';

function HomePage() {
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compsResponse, statsResponse] = await Promise.all([
          competitionsAPI.getAll('active'),
          statisticsAPI.getPlatform()
        ]);
        setActiveCompetitions(compsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Ładowanie...</div>;
  }

  return (
    <div className="home-page">
      <section className="hero">
        <h1>xTraMarlin</h1>
        <p className="hero-subtitle">
          Nowoczesny system sędziowania zawodów wędkarskich opartych na zdjęciach ryb
        </p>
        <div className="hero-buttons">
          <Link to="/competitions" className="btn btn-primary btn-large">
            Zobacz Zawody
          </Link>
          <Link to="/register" className="btn btn-secondary btn-large">
            Zarejestruj się
          </Link>
        </div>
      </section>

      {stats && (
        <section className="stats-section">
          <h2>Statystyki Platformy</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total_competitors}</div>
              <div className="stat-label">Zawodnicy</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.active_competitions}</div>
              <div className="stat-label">Aktywne Zawody</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.total_competitions}</div>
              <div className="stat-label">Wszystkie Zawody</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.total_approved_catches}</div>
              <div className="stat-label">Złowione Ryby</div>
            </div>
          </div>
        </section>
      )}

      <section className="active-competitions">
        <h2>Aktywne Zawody</h2>
        {activeCompetitions.length > 0 ? (
          <div className="competitions-grid">
            {activeCompetitions.map((comp) => (
              <Link
                key={comp.id}
                to={`/competitions/${comp.id}`}
                className="competition-card"
              >
                <h3>{comp.name}</h3>
                <p className="competition-organizer">
                  Organizator: {comp.organizer_name}
                </p>
                <p className="competition-date">
                  {new Date(comp.start_date).toLocaleDateString('pl-PL')} -{' '}
                  {new Date(comp.end_date).toLocaleDateString('pl-PL')}
                </p>
                <span className="competition-status active">TRWA</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-data">Brak aktywnych zawodów</p>
        )}
      </section>

      <section className="features">
        <h2>Funkcjonalności</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3>Responsywny interfejs</h3>
            <p>Działa na komputerach, tabletach i smartfonach</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📸</span>
            <h3>Uploady zdjęć</h3>
            <p>Łatwe przesyłanie zdjęć złowionych ryb</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Wyniki na żywo</h3>
            <p>Śledzenie pozycji w rankingu w czasie rzeczywistym</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Automatyczne statystyki</h3>
            <p>Szczegółowe analizy i podsumowania zawodów</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👥</span>
            <h3>Dla zawodników i kibiców</h3>
            <p>Dostęp do wyników dla uczestników i obserwatorów</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Łatwe zarządzanie</h3>
            <p>Intuicyjny panel dla organizatorów</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
