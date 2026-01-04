# xTraMarlin - Dokumentacja Strony

## 📋 Przegląd

Strona internetowa dla xTraMarlin - platformy do zarządzania zawodami spinningowymi i kajakowymi. Projekt realizuje pełną strukturę homepage zgodną z wymaganiami UX/UI i kompetencjami merytorycznymi.

## 🎯 Struktura Projektu

### Strony HTML

1. **index.html** - Strona główna
   - Hero section z jasnym value proposition
   - Sekcja "Jak działa" (4 kroki)
   - Funkcje platformy (6 kart funkcji)
   - Dla kogo (3 grupy użytkowników)
   - Social proof (liczby + testimoniale)
   - CTA section

2. **leaderboard.html** - Tabela wyników na żywo
   - Responsywna tabela wyników (desktop) i karty (mobile)
   - Filtry i wyszukiwarka
   - Podświetlenie aktualnego użytkownika
   - Real-time update simulation

3. **zawody.html** - Lista zawodów
   - Karty zawodów (reusable component)
   - Filtry: status, dyscyplina, lokalizacja
   - Różne stany: live, upcoming, finished, series

4. **o-nas.html** - O nas
   - Historia firmy
   - Misja i wartości (6 kart)
   - Zespół (3 osoby)
   - Osiągnięcia (liczby)
   - Sekcja partnerów/sponsorów

5. **instrukcja.html** - Instrukcja obsługi
   - Dla organizatorów (7 kroków)
   - Dla zawodników (5 kroków)
   - Dla sędziów (3 kroki)
   - FAQ

6. **oferta.html** - Cennik i pakiety
   - 3 pakiety (Start, Pro, Enterprise)
   - Tabela porównawcza
   - Rabaty dla cykli
   - FAQ o cenach

## 🎨 Design System

### Kolory
- **Primary (Sky)**: `#0EA5E9` - główny kolor brandingu
- **Secondary (Green)**: `#10B981` - akcenty, success states
- **Accent (Amber)**: `#F59E0B` - wyróżnienia, premium features
- **Gray Scale**: od `#F9FAFB` do `#111827` - tło i teksty

### Typografia
- Font: System fonts (font-sans)
- Nagłówki: bold, duże rozmiary (text-3xl do text-5xl)
- Tekst: text-base do text-xl, czytelne odstępy

### Komponenty

#### CompetitionCard (Karta zawodów)
```html
<div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
  <!-- Zdjęcie, status badge, dane, CTA buttons -->
</div>
```

#### FeatureCard (Karta funkcji)
```html
<div class="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">
  <!-- Ikona emoji, tytuł, opis, benefit -->
</div>
```

#### LeaderboardTable (Tabela wyników)
- Desktop: pełna tabela z wszystkimi kolumnami
- Mobile: karty z najważniejszymi danymi
- User highlight: żółte tło dla zalogowanego użytkownika

#### SponsorBlock (Blok sponsorów)
```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
  <!-- Placeholder logo boxes -->
</div>
```

## 🔌 Integracja z API

### Planowane endpointy

#### Zawody
- `GET /api/competitions` - lista zawodów (z filtrami)
- `GET /api/competitions/{id}` - szczegóły zawodów
- `GET /api/competitions/{id}/leaderboard` - tabela wyników
- `POST /api/competitions/{id}/register` - zapis na zawody

#### Ryby
- `POST /api/competitions/{id}/catches` - zgłoszenie połowu
- `GET /api/competitions/{id}/catches` - lista połowów
- `PATCH /api/catches/{id}/verify` - weryfikacja przez sędziego

#### Użytkownicy
- `GET /api/users/{id}/profile` - profil zawodnika
- `GET /api/users/{id}/stats` - statystyki zawodnika

#### Partnerzy
- `GET /api/partners` - lista partnerów/sponsorów

### Real-time Updates

Tabela wyników powinna być aktualizowana przez:
- **WebSocket** (preferowane): `/ws/competitions/{id}/leaderboard`
- **Polling** (fallback): co 30 sekund `GET /api/competitions/{id}/leaderboard?updated_since={timestamp}`

## 📱 Responsywność

### Breakpointy (Tailwind)
- **sm**: 640px - małe tablety pionowo
- **md**: 768px - tablety poziomo  
- **lg**: 1024px - małe laptopy
- **xl**: 1280px - desktopy

### Mobile-first approach
- Grid kolumny: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Flexbox: `flex-col sm:flex-row`
- Tabela → karty: `hidden md:block` + `md:hidden`

## 🎯 SEO Optimization

### Meta Tags
Każda strona zawiera:
- `<title>` - unikalny tytuł
- `<meta name="description">` - opis strony
- `<meta name="keywords">` - słowa kluczowe

### Struktura nagłówków
- **H1**: jeden na stronę, główny temat
- **H2**: sekcje główne
- **H3**: podsekcje
- Semantyczny HTML: `<nav>`, `<section>`, `<footer>`

### Słowa kluczowe
- zawody spinningowe
- zawody kajakowe
- catch and release
- live score
- wyniki na żywo
- platforma zawodów wędkarskich

## 🚀 Deployment

### Hosting
Strony są statyczne i mogą być hostowane na:
- GitHub Pages
- Netlify
- Vercel
- Dowolny hosting statyczny

### CDN
Używamy Tailwind CSS z CDN dla prostoty:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Produkcja**: Zalecane jest użycie build process z Tailwind CLI dla mniejszego rozmiaru plików.

## 🎨 Style i konwencje

### Język
- **Polski** - cała treść w języku polskim
- Ton: profesjonalny ale przystępny ("pro, ale prosty")
- Unikamy żargonu technicznego

### Ikony
- Emoji (🎣, 🏆, 📊, ⚡) - szybkie, uniwersalne, nie wymagają bibliotek
- SVG inline - dla ikon interfejsu (social media, navigation)

### Obrazy
Obecnie używamy placeholderów z Unsplash:
- `https://images.unsplash.com/photo-...?w=400&h=200&fit=crop`

**Produkcja**: Zamienić na właściwe zdjęcia zawodów, zawodników, sprzętu.

## 📝 Komentarze w kodzie

Każda sekcja zawiera komentarze:
```html
<!-- Cel: Co ta sekcja ma osiągnąć -->
<!-- Integracja: Gdzie podpiąć API -->
<!-- Dla kogo: Grupa docelowa -->
```

## 🔄 Przyszłe ulepszenia

### Funkcjonalność
1. Dodać JavaScript dla:
   - Real-time updates (WebSocket)
   - Filtry i wyszukiwanie (client-side)
   - Animacje przy scroll
   - Lazy loading obrazów

2. Dodać formularze:
   - Rejestracja użytkownika
   - Zgłoszenie zawodów
   - Kontakt

3. Dodać autentykację:
   - Login/logout
   - Panel użytkownika
   - Panel organizatora

### Performance
1. Optymalizacja obrazów (WebP, lazy loading)
2. Minifikacja CSS/JS
3. Caching strategia
4. Service Worker dla offline

### Accessibility
1. ARIA labels
2. Keyboard navigation
3. Screen reader optimization
4. Contrast ratio checks

## 📧 Kontakt

**Email**: kontakt@xtramarlin.pl  
**Tel**: +48 123 456 789

## 📄 Licencja

© 2024 xTraMarlin. Wszystkie prawa zastrzeżone.
