# xTraMarlin - System Sędziowania Zawodów Wędkarskich

## Opis Projektu

xTraMarlin to nowoczesny, kompleksowy system do zarządzania i sędziowania zawodów wędkarskich opartych na zdjęciach ryb. System oferuje:

- **Responsywny frontend** - Działa na komputerach, tabletach i smartfonach
- **Szybki backend** - Zoptymalizowany API z Node.js i Express
- **Tabele na żywo** - Aktualizacje w czasie rzeczywistym przez WebSocket
- **Automatyczne statystyki** - Szczegółowe analizy zawodów i uczestników
- **Zarządzanie użytkownikami** - Role: zawodnicy, organizatorzy, kibice

## Technologie

### Backend
- **Node.js** + **Express.js** - Serwer API
- **SQLite** - Baza danych
- **WebSocket (ws)** - Komunikacja w czasie rzeczywistym
- **JWT** - Autentykacja
- **Multer** - Upload plików

### Frontend
- **React 18** - Biblioteka UI
- **Vite** - Narzędzie budowania
- **React Router** - Routing
- **Axios** - Klient HTTP

## Struktura Projektu

```
nowy-xtramarlin/
├── backend/
│   ├── src/
│   │   ├── config/          # Konfiguracja (baza danych)
│   │   ├── routes/          # Endpointy API
│   │   ├── middleware/      # Middleware (auth)
│   │   └── server.js        # Główny plik serwera
│   ├── uploads/             # Przesłane zdjęcia
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Komponenty React
│   │   ├── pages/           # Strony aplikacji
│   │   ├── styles/          # Pliki CSS
│   │   ├── contexts/        # Context API
│   │   ├── utils/           # Narzędzia (API client)
│   │   ├── App.jsx          # Główny komponent
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   └── package.json
└── docs/                    # Dokumentacja
```

## Instalacja i Uruchomienie

### Wymagania
- Node.js 16+ 
- npm lub yarn

### Backend

1. Przejdź do katalogu backend:
```bash
cd backend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Utwórz plik `.env` (opcjonalnie):
```bash
cp .env.example .env
```

4. Uruchom serwer:
```bash
# Development mode z auto-reload
npm run dev

# Production mode
npm start
```

Serwer uruchomi się na `http://localhost:3001`

### Frontend

1. Przejdź do katalogu frontend:
```bash
cd frontend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację:
```bash
# Development mode
npm run dev

# Production build
npm run build
```

Aplikacja uruchomi się na `http://localhost:3000`

## API Endpoints

### Autentykacja
- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie

### Zawody
- `GET /api/competitions` - Lista zawodów
- `GET /api/competitions/:id` - Szczegóły zawodów
- `POST /api/competitions` - Utworzenie zawodów (organizatorzy)
- `POST /api/competitions/:id/register` - Rejestracja do zawodów
- `GET /api/competitions/:id/leaderboard` - Tabela wyników

### Zdjęcia
- `POST /api/photos/upload` - Upload zdjęcia ryby
- `GET /api/photos/competition/:id` - Zdjęcia z zawodów
- `GET /api/photos/my-photos` - Własne zdjęcia
- `PUT /api/photos/:id/judge` - Ocena zdjęcia (organizatorzy)

### Statystyki
- `GET /api/statistics/platform` - Statystyki platformy
- `GET /api/statistics/competition/:id` - Statystyki zawodów
- `GET /api/statistics/user/:id` - Statystyki użytkownika
- `GET /api/statistics/competition/:id/timeline` - Timeline aktywności

## Funkcjonalności

### Dla Zawodników
- Rejestracja do zawodów
- Upload zdjęć złowionych ryb
- Podgląd własnych wyników
- Śledzenie pozycji w rankingu na żywo

### Dla Organizatorów
- Tworzenie nowych zawodów
- Zarządzanie zawodami
- Ocenianie przesłanych zdjęć
- Przyznawanie punktów
- Podgląd statystyk

### Dla Kibiców
- Przeglądanie aktywnych zawodów
- Śledzenie tabeli wyników na żywo
- Podgląd statystyk zawodów

## WebSocket - Live Updates

System wykorzystuje WebSocket do aktualizacji w czasie rzeczywistym:
- Nowe zdjęcia
- Ocenione połowy
- Aktualizacje tabeli wyników

Połączenie WebSocket: `ws://localhost:3001`

## Baza Danych

System używa SQLite z następującymi tabelami:
- `users` - Użytkownicy
- `competitions` - Zawody
- `participants` - Uczestnicy zawodów
- `photos` - Zdjęcia ryb
- `leaderboard` - Tabela wyników

## Rozwój

### Linting
```bash
npm run lint
```

### Testy
```bash
npm test
```

## Deployment

### Backend
1. Ustaw zmienne środowiskowe w production
2. Zmień `JWT_SECRET` na bezpieczny klucz
3. Skonfiguruj bazę danych (można użyć PostgreSQL zamiast SQLite)
4. Uruchom `npm start`

### Frontend
1. Zbuduj aplikację: `npm run build`
2. Serwuj katalog `dist` za pomocą serwera statycznego

## Bezpieczeństwo

- JWT do autentykacji
- Hashowane hasła (bcrypt)
- Walidacja plików przy uploadzie
- Role-based access control (RBAC)
- Limit rozmiaru plików (10MB)

## Licencja

MIT

## Kontakt

Dla pytań i wsparcia, otwórz issue na GitHubie.
