# Quick Start Guide - xTraMarlin

## Szybkie uruchomienie z Docker Compose

### Wymagania
- Docker
- Docker Compose

### Krok 1: Sklonuj repozytorium
```bash
git clone https://github.com/lesoxm/nowy-xtramarlin.git
cd nowy-xtramarlin
```

### Krok 2: Uruchom aplikację
```bash
docker-compose up -d
```

### Krok 3: Otwórz w przeglądarce
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## Uruchomienie bez Dockera

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend będzie dostępny na: http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend będzie dostępny na: http://localhost:3000

---

## Pierwsze kroki w aplikacji

### 1. Zarejestruj się jako organizator
1. Kliknij "Rejestracja"
2. Wybierz rolę "Organizator"
3. Wypełnij dane i zarejestruj się

### 2. Utwórz zawody
1. Przejdź do "Panel"
2. Kliknij "Utwórz zawody"
3. Wypełnij dane zawodów:
   - Nazwa zawodów
   - Opis
   - Data rozpoczęcia
   - Data zakończenia

### 3. Zarejestruj się jako zawodnik (inna przeglądarka/incognito)
1. Zarejestruj nowe konto jako "Zawodnik"
2. Przejdź do "Zawody"
3. Wybierz zawody i kliknij "Zarejestruj się"

### 4. Prześlij zdjęcie ryby
1. Zaloguj się jako zawodnik
2. Przejdź do "Panel" → "Prześlij zdjęcie"
3. Wybierz zawody
4. Dodaj zdjęcie i informacje o rybie
5. Prześlij

### 5. Oceń zdjęcie jako organizator
1. Zaloguj się jako organizator
2. Przejdź do szczegółów zawodów
3. Oceń przesłane zdjęcia
4. Przyznaj punkty

### 6. Zobacz tabelę na żywo
1. Przejdź do aktywnych zawodów
2. Kliknij "🔴 Live"
3. Obserwuj aktualizacje w czasie rzeczywistym

---

## Testowe konta (opcjonalnie)

Możesz utworzyć testowe konta:

**Organizator:**
- Username: `organizator_test`
- Password: `Test123!`
- Role: Organizer

**Zawodnik:**
- Username: `zawodnik_test`
- Password: `Test123!`
- Role: Competitor

**Kibic:**
- Username: `kibic_test`
- Password: `Test123!`
- Role: Spectator

---

## Funkcje do przetestowania

### ✅ Dla organizatorów:
- [ ] Tworzenie zawodów
- [ ] Przeglądanie zawodów
- [ ] Ocenianie zdjęć
- [ ] Przyznawanie punktów
- [ ] Przeglądanie statystyk

### ✅ Dla zawodników:
- [ ] Rejestracja do zawodów
- [ ] Przesyłanie zdjęć ryb
- [ ] Przeglądanie własnych zdjęć
- [ ] Śledzenie własnych statystyk
- [ ] Obserwowanie pozycji w rankingu

### ✅ Dla kibiców:
- [ ] Przeglądanie zawodów
- [ ] Obserwowanie tabeli na żywo
- [ ] Przeglądanie statystyk
- [ ] Oglądanie zatwierdzonych zdjęć

### ✅ Funkcje na żywo:
- [ ] Automatyczne odświeżanie tabeli
- [ ] WebSocket updates po ocenie zdjęcia
- [ ] Pulsująca ikona "LIVE"
- [ ] Automatyczne aktualizacje co 30s

---

## Rozwiązywanie problemów

### Backend nie startuje
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Frontend nie startuje
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Docker problemy
```bash
docker-compose down
docker-compose up --build
```

### Port zajęty
Jeśli porty 3000 lub 3001 są zajęte, możesz je zmienić:

Backend: w pliku `backend/.env` ustaw `PORT=NOWY_PORT`
Frontend: w pliku `frontend/vite.config.js` zmień `port`

---

## Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź logi: `docker-compose logs`
2. Sprawdź czy porty są dostępne
3. Upewnij się, że Node.js jest w wersji 16+
4. Otwórz issue na GitHubie

---

## Następne kroki

Po przetestowaniu podstawowych funkcji, możesz:
- Dodać więcej zawodników
- Przeprowadzić pełne zawody
- Przetestować funkcje statystyk
- Sprawdzić responsywność na urządzeniach mobilnych
- Dostosować wygląd w plikach CSS
