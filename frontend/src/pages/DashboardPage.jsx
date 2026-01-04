import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { competitionsAPI, photosAPI, statisticsAPI } from '../utils/api';
import '../styles/DashboardPage.css';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [myCompetitions, setMyCompetitions] = useState([]);
  const [myPhotos, setMyPhotos] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // For organizers creating competitions
  const [newCompetition, setNewCompetition] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const [createMessage, setCreateMessage] = useState('');

  // For competitors uploading photos
  const [uploadData, setUploadData] = useState({
    competition_id: '',
    fish_species: '',
    length_cm: '',
    weight_kg: '',
    photo: null
  });
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user.role === 'competitor') {
        const [photosResponse, statsResponse] = await Promise.all([
          photosAPI.getMyPhotos(),
          statisticsAPI.getUser(user.id)
        ]);
        setMyPhotos(photosResponse.data);
        setUserStats(statsResponse.data);
      }
      
      const compsResponse = await competitionsAPI.getAll();
      setMyCompetitions(compsResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    setCreateMessage('');
    
    try {
      await competitionsAPI.create(newCompetition);
      setCreateMessage('Zawody utworzone pomyślnie!');
      setNewCompetition({ name: '', description: '', start_date: '', end_date: '' });
      fetchDashboardData();
    } catch (error) {
      setCreateMessage(error.response?.data?.error || 'Błąd tworzenia zawodów');
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    setUploadMessage('');

    const formData = new FormData();
    formData.append('photo', uploadData.photo);
    formData.append('competition_id', uploadData.competition_id);
    formData.append('fish_species', uploadData.fish_species);
    formData.append('length_cm', uploadData.length_cm);
    formData.append('weight_kg', uploadData.weight_kg);

    try {
      await photosAPI.upload(formData);
      setUploadMessage('Zdjęcie przesłane pomyślnie!');
      setUploadData({ competition_id: '', fish_species: '', length_cm: '', weight_kg: '', photo: null });
      fetchDashboardData();
    } catch (error) {
      setUploadMessage(error.response?.data?.error || 'Błąd przesyłania zdjęcia');
    }
  };

  if (loading) {
    return <div className="loading">Ładowanie panelu...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Panel użytkownika</h1>
      <p className="user-welcome">Witaj, {user.username}! ({user.role})</p>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Przegląd
        </button>
        {user.role === 'competitor' && (
          <>
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Prześlij zdjęcie
            </button>
            <button
              className={`tab ${activeTab === 'myphotos' ? 'active' : ''}`}
              onClick={() => setActiveTab('myphotos')}
            >
              Moje zdjęcia
            </button>
          </>
        )}
        {user.role === 'organizer' && (
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Utwórz zawody
          </button>
        )}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h2>Przegląd</h2>
            
            {user.role === 'competitor' && userStats && (
              <div className="user-stats">
                <h3>Twoje statystyki</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-number">{userStats.competitions_entered}</span>
                    <span className="stat-label">Zawody</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{userStats.total_catches}</span>
                    <span className="stat-label">Zdjęcia</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{userStats.approved_catches}</span>
                    <span className="stat-label">Zatwierdzone</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{userStats.total_points}</span>
                    <span className="stat-label">Punkty</span>
                  </div>
                </div>
              </div>
            )}

            <div className="recent-competitions">
              <h3>Dostępne zawody</h3>
              {myCompetitions.length > 0 ? (
                <ul className="competitions-list">
                  {myCompetitions.slice(0, 5).map(comp => (
                    <li key={comp.id} className="competition-item">
                      <span className="comp-name">{comp.name}</span>
                      <span className={`comp-status ${comp.status}`}>
                        {comp.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Brak zawodów</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'upload' && user.role === 'competitor' && (
          <div className="upload-tab">
            <h2>Prześlij zdjęcie ryby</h2>
            {uploadMessage && <div className="message">{uploadMessage}</div>}
            
            <form onSubmit={handlePhotoUpload} className="upload-form">
              <div className="form-group">
                <label>Wybierz zawody *</label>
                <select
                  value={uploadData.competition_id}
                  onChange={(e) => setUploadData({ ...uploadData, competition_id: e.target.value })}
                  required
                >
                  <option value="">-- Wybierz zawody --</option>
                  {myCompetitions.filter(c => c.status === 'active').map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Zdjęcie *</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => setUploadData({ ...uploadData, photo: e.target.files[0] })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gatunek ryby</label>
                <input
                  type="text"
                  value={uploadData.fish_species}
                  onChange={(e) => setUploadData({ ...uploadData, fish_species: e.target.value })}
                  placeholder="np. Karp, Szczupak, Okoń"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Długość (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={uploadData.length_cm}
                    onChange={(e) => setUploadData({ ...uploadData, length_cm: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Waga (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={uploadData.weight_kg}
                    onChange={(e) => setUploadData({ ...uploadData, weight_kg: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Prześlij zdjęcie
              </button>
            </form>
          </div>
        )}

        {activeTab === 'myphotos' && user.role === 'competitor' && (
          <div className="myphotos-tab">
            <h2>Moje zdjęcia</h2>
            {myPhotos.length > 0 ? (
              <div className="photos-list">
                {myPhotos.map(photo => (
                  <div key={photo.id} className="photo-item">
                    <img
                      src={`http://localhost:3001${photo.file_path}`}
                      alt="Fish"
                      className="photo-thumbnail"
                    />
                    <div className="photo-details">
                      <p><strong>Zawody:</strong> {photo.competition_name}</p>
                      {photo.fish_species && <p><strong>Gatunek:</strong> {photo.fish_species}</p>}
                      <p><strong>Status:</strong> <span className={`status ${photo.judging_status}`}>
                        {photo.judging_status}
                      </span></p>
                      {photo.judging_status === 'approved' && (
                        <p><strong>Punkty:</strong> {photo.points}</p>
                      )}
                      <p className="photo-date">
                        {new Date(photo.upload_time).toLocaleString('pl-PL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nie przesłałeś jeszcze żadnych zdjęć</p>
            )}
          </div>
        )}

        {activeTab === 'create' && user.role === 'organizer' && (
          <div className="create-tab">
            <h2>Utwórz nowe zawody</h2>
            {createMessage && <div className="message">{createMessage}</div>}
            
            <form onSubmit={handleCreateCompetition} className="create-form">
              <div className="form-group">
                <label>Nazwa zawodów *</label>
                <input
                  type="text"
                  value={newCompetition.name}
                  onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Opis</label>
                <textarea
                  value={newCompetition.description}
                  onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data rozpoczęcia *</label>
                  <input
                    type="datetime-local"
                    value={newCompetition.start_date}
                    onChange={(e) => setNewCompetition({ ...newCompetition, start_date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Data zakończenia *</label>
                  <input
                    type="datetime-local"
                    value={newCompetition.end_date}
                    onChange={(e) => setNewCompetition({ ...newCompetition, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Utwórz zawody
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
