import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { competitionsAPI, statisticsAPI, photosAPI } from '../utils/api';
import '../styles/CompetitionDetailPage.css';

function CompetitionDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [competition, setCompetition] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [compResponse, statsResponse, photosResponse] = await Promise.all([
        competitionsAPI.getById(id),
        statisticsAPI.getCompetition(id),
        photosAPI.getByCompetition(id, 'approved')
      ]);
      setCompetition(compResponse.data);
      setStatistics(statsResponse.data);
      setPhotos(photosResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    setMessage('');
    try {
      await competitionsAPI.register(id);
      setMessage('Pomyślnie zarejestrowano do zawodów!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Błąd rejestracji');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="loading">Ładowanie szczegółów zawodów...</div>;
  }

  if (!competition) {
    return <div className="error">Nie znaleziono zawodów</div>;
  }

  return (
    <div className="competition-detail-page">
      <div className="competition-header">
        <h1>{competition.name}</h1>
        <span className={`status-badge ${competition.status}`}>
          {competition.status === 'active' && '🔴 TRWA'}
          {competition.status === 'upcoming' && '📅 Nadchodzące'}
          {competition.status === 'completed' && '✅ Zakończone'}
        </span>
      </div>

      <div className="competition-info-section">
        <div className="info-card">
          <h3>Informacje</h3>
          <p><strong>Organizator:</strong> {competition.organizer_name}</p>
          <p><strong>Start:</strong> {new Date(competition.start_date).toLocaleString('pl-PL')}</p>
          <p><strong>Koniec:</strong> {new Date(competition.end_date).toLocaleString('pl-PL')}</p>
          {competition.description && (
            <p><strong>Opis:</strong> {competition.description}</p>
          )}
        </div>

        {user && user.role === 'competitor' && competition.status !== 'completed' && (
          <div className="action-card">
            <h3>Dołącz do zawodów</h3>
            {message && <p className="message">{message}</p>}
            <button
              onClick={handleRegister}
              disabled={registering}
              className="btn btn-primary"
            >
              {registering ? 'Rejestracja...' : 'Zarejestruj się'}
            </button>
          </div>
        )}
      </div>

      {competition.status === 'active' && (
        <div className="live-section">
          <Link to={`/competitions/${id}/live`} className="btn btn-primary btn-large">
            🔴 Zobacz tabelę na żywo
          </Link>
        </div>
      )}

      {statistics && (
        <div className="statistics-section">
          <h2>Statystyki</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-value">{statistics.basic.total_participants}</span>
              <span className="stat-label">Uczestników</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{statistics.basic.approved_photos}</span>
              <span className="stat-label">Zatwierdzonych ryb</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{statistics.basic.pending_photos}</span>
              <span className="stat-label">Oczekujących</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{statistics.basic.total_photos}</span>
              <span className="stat-label">Wszystkich zdjęć</span>
            </div>
          </div>

          {statistics.fish_statistics.length > 0 && (
            <div className="fish-stats">
              <h3>Statystyki gatunków</h3>
              <table className="fish-table">
                <thead>
                  <tr>
                    <th>Gatunek</th>
                    <th>Ilość</th>
                    <th>Śr. długość (cm)</th>
                    <th>Maks. długość (cm)</th>
                    <th>Śr. waga (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.fish_statistics.map((fish, idx) => (
                    <tr key={idx}>
                      <td>{fish.fish_species}</td>
                      <td>{fish.count}</td>
                      <td>{fish.avg_length?.toFixed(1) || '-'}</td>
                      <td>{fish.max_length?.toFixed(1) || '-'}</td>
                      <td>{fish.avg_weight?.toFixed(2) || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div className="photos-section">
          <h2>Zatwierdzone połowy</h2>
          <div className="photos-grid">
            {photos.slice(0, 12).map((photo) => (
              <div key={photo.id} className="photo-card">
                <img
                  src={`http://localhost:3001${photo.file_path}`}
                  alt={`${photo.fish_species || 'Ryba'}`}
                />
                <div className="photo-info">
                  <p className="photo-user">{photo.username}</p>
                  {photo.fish_species && <p className="photo-species">{photo.fish_species}</p>}
                  <p className="photo-points">{photo.points} pkt</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompetitionDetailPage;
