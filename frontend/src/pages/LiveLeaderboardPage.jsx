import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { competitionsAPI } from '../utils/api';
import '../styles/LiveLeaderboardPage.css';

function LiveLeaderboardPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [ws, setWs] = useState(null);

  useEffect(() => {
    fetchData();

    // Set up WebSocket connection for live updates
    const websocket = new WebSocket('ws://localhost:3001');
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'photo_judged' && data.data.competition_id === id) {
        // Refresh leaderboard when photos are judged
        fetchLeaderboard();
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 30000);

    return () => {
      if (websocket) {
        websocket.close();
      }
      clearInterval(interval);
    };
  }, [id]);

  const fetchData = async () => {
    try {
      const [compResponse, leaderboardResponse] = await Promise.all([
        competitionsAPI.getById(id),
        competitionsAPI.getLeaderboard(id)
      ]);
      setCompetition(compResponse.data);
      setLeaderboard(leaderboardResponse.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await competitionsAPI.getLeaderboard(id);
      setLeaderboard(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  if (loading) {
    return <div className="loading">Ładowanie tabeli na żywo...</div>;
  }

  if (!competition) {
    return <div className="error">Nie znaleziono zawodów</div>;
  }

  return (
    <div className="live-leaderboard-page">
      <div className="live-header">
        <div className="live-indicator">
          <span className="pulse-dot"></span>
          <span className="live-text">NA ŻYWO</span>
        </div>
        <h1>{competition.name}</h1>
        <p className="last-update">
          Ostatnia aktualizacja: {lastUpdate.toLocaleTimeString('pl-PL')}
        </p>
      </div>

      <div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="rank-col">Miejsce</th>
              <th className="name-col">Zawodnik</th>
              <th className="fish-col">Ryby</th>
              <th className="points-col">Punkty</th>
              <th className="time-col">Ostatni połów</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr
                  key={entry.user_id}
                  className={`leaderboard-row ${index < 3 ? `podium-${index + 1}` : ''}`}
                >
                  <td className="rank-col">
                    {index === 0 && <span className="medal">🥇</span>}
                    {index === 1 && <span className="medal">🥈</span>}
                    {index === 2 && <span className="medal">🥉</span>}
                    {index > 2 && <span className="rank-number">{index + 1}</span>}
                  </td>
                  <td className="name-col">
                    <div className="name-display">
                      <span className="username">{entry.username}</span>
                      {entry.full_name && (
                        <span className="full-name">{entry.full_name}</span>
                      )}
                    </div>
                  </td>
                  <td className="fish-col">
                    <span className="fish-count">{entry.total_fish}</span>
                  </td>
                  <td className="points-col">
                    <span className="points-display">{entry.total_points}</span>
                  </td>
                  <td className="time-col">
                    {entry.last_catch ? (
                      new Date(entry.last_catch).toLocaleTimeString('pl-PL', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  Brak uczestników lub zatwierdzonych połowów
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-info">
        <p>
          📊 Tabela aktualizuje się automatycznie po każdym ocenionym połowie
        </p>
        <p>
          🔄 Auto-odświeżanie co 30 sekund
        </p>
      </div>
    </div>
  );
}

export default LiveLeaderboardPage;
