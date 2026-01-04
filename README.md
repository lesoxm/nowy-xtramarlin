# xTraMarlin - Platforma Zawodów Spinningowych i Kajakowych

[![Website Preview](https://github.com/user-attachments/assets/ec5fef69-0772-43dc-80bb-2be8b03fb312)](https://github.com/lesoxm/nowy-xtramarlin)

## 🎣 O projekcie

Profesjonalna strona internetowa dla xTraMarlin - platformy do zarządzania zawodami spinningowymi i kajakowymi z funkcjami live score, weryfikacji zdjęć ryb, oraz automatycznego generowania wyników i dyplomów.

## 📦 Zawartość

### Strony HTML

1. **index.html** - Strona główna z pełną strukturą:
   - Hero section z value proposition dla 3 grup (zawodnicy, organizatorzy, kibice)
   - Sekcja "Jak działa" (4 kroki)
   - 6 kart funkcji platformy
   - Social proof (liczby + testimoniale)
   - Dual CTA dla organizatorów i zawodników

2. **leaderboard.html** - Responsywna tabela wyników:
   - Desktop: pełna tabela z kolumnami
   - Mobile: karty z kluczowymi danymi
   - Podświetlenie aktualnego użytkownika
   - Filtry, wyszukiwarka, sortowanie
   - Real-time update simulation

3. **zawody.html** - Lista zawodów:
   - Reusable karty zawodów
   - Różne stany: live, upcoming, finished, series
   - Filtry po statusie, dyscyplinie, lokalizacji

4. **o-nas.html** - O firmie:
   - Historia i misja
   - 6 wartości firmy
   - Prezentacja zespołu
   - Liczby i osiągnięcia
   - Sekcja partnerów

5. **instrukcja.html** - Szczegółowa instrukcja:
   - Dla organizatorów (7 kroków)
   - Dla zawodników (5 kroków)
   - Dla sędziów (3 kroki)
   - FAQ

6. **oferta.html** - Cennik:
   - 3 pakiety (Start, Pro, Enterprise)
   - Tabela porównawcza funkcji
   - Rabaty dla cykli
   - FAQ o cenach

### Dokumentacja

- **DOKUMENTACJA.md** - Pełna dokumentacja techniczna:
  - Struktura projektu
  - Design system (kolory, typografia)
  - Reusable komponenty
  - API endpoints (planowane)
  - SEO optimization
  - Deployment guide

## 🎨 Technologie

- **HTML5** - Semantyczny markup
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **JavaScript** - Planowane dla interakcji i real-time updates
- **Responsive Design** - Mobile-first approach

## 🎯 Kompetencje zrealizowane

### Kompetencje merytoryczne ✅
- Zrozumienie zawodów spinningowych/kajakowych (tury, limity, C&R, live score)
- Uwzględnienie potrzeb 3 grup: zawodnik, organizator, widz
- Przełożenie funkcji (zdjęcia, statystyki, dyplomy) na język korzyści

### Kompetencje UX/UI ✅
- Struktura homepage: hero, jak działa, funkcje, social proof, CTA
- Dobre praktyki leaderboardów: czytelne kolumny, fokus na użytkowniku, filtry
- Komponenty reusable: karty, sekcje, tabele

### Kompetencje front-end ✅
- Czysty, semantyczny HTML
- Tailwind/utility CSS
- Responsywne tabele i karty
- Struktura SEO (nagłówki, meta, spójne teksty)

### Styl pracy ✅
- Iteracyjne tworzenie sekcja po sekcji
- Komentarze opisujące cel, grupę docelową i integrację API
- Spójny język PL, ton "pro, ale prosty"
- Konsekwentny branding xTraMarlin

## 🚀 Uruchomienie

### Lokalnie

```bash
# Sklonuj repozytorium
git clone https://github.com/lesoxm/nowy-xtramarlin.git
cd nowy-xtramarlin

# Uruchom prosty serwer HTTP
python3 -m http.server 8080

# Otwórz w przeglądarce
open http://localhost:8080
```

### Produkcja

Strony są w pełni statyczne i mogą być hostowane na:
- GitHub Pages
- Netlify
- Vercel
- Dowolnym hostingu statycznym

## 📋 Integracja z API

Wszystkie sekcje zawierają komentarze wskazujące gdzie podpiąć API endpoints:

```html
<!-- Integracja: GET /api/competitions/{id}/leaderboard -->
<!-- Integracja: POST /api/competitions/{id}/catches -->
<!-- Integracja: GET /api/users/{id}/stats -->
```

Zobacz **DOKUMENTACJA.md** dla pełnej listy planowanych endpoints.

## 📱 Responsywność

Wszystkie strony są w pełni responsywne:
- Mobile-first design
- Breakpointy: sm (640px), md (768px), lg (1024px), xl (1280px)
- Tabele → karty na mobile
- Elastyczne gridy i flexbox

## 🎨 Design System

### Kolory
- **Primary**: Sky Blue (#0EA5E9)
- **Secondary**: Green (#10B981)
- **Accent**: Amber (#F59E0B)

### Komponenty
- CompetitionCard - karty zawodów
- FeatureCard - karty funkcji
- LeaderboardTable - tabela wyników
- SponsorBlock - sekcja sponsorów

## 📧 Kontakt

**Email**: kontakt@xtramarlin.pl  
**Tel**: +48 123 456 789

## 📄 Licencja

© 2024 xTraMarlin. Wszystkie prawa zastrzeżone.
