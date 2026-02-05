# Rick and Morty Character Explorer

> Modern Progressive Web App to explore characters from Rick and Morty series

## Tech Stack

- React 18.3.1
- TypeScript 5.6.3
- React Router DOM 6.26.2
- Apollo Client 3.11.8
- Tailwind CSS 4.0.0
- Vite 5.4.11
- PWA (vite-plugin-pwa 0.20.5)

## Features

- Search and filter characters
- Mark favorites (synced across tabs)
- Add comments
- Fully responsive
- Works offline (PWA)
- Update notifications
- Installable on any device
- Accessibility compliant (WCAG 2.1 AA)
- Optimized performance

## PWA Features

- Service Worker with intelligent caching
- Offline functionality
- Install prompt for desktop and mobile
- Push notifications for updates
- App-like experience when installed
- Fast load times with pre-caching

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone repository
git clone [url]

# Install dependencies (exact versions, no caret)
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server (PWA enabled)
- `npm run build` - Build for production with PWA
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Architecture

This project follows a feature-based architecture with strict separation of concerns:

- **Core**: App initialization, routing, providers
- **Features**: Self-contained modules (characters, favorites, comments)
- **Shared**: Reusable components, hooks, utilities
- **PWA**: Progressive Web App components and utilities

## Project Structure

```
src/
├── core/                           # App initialization
│   ├── config/
│   │   ├── apollo.config.ts        # Apollo Client setup
│   │   ├── routes.config.ts        # Route definitions
│   │   ├── router.tsx              # Router configuration
│   │   └── pwa.config.ts           # PWA registration
│   ├── providers/
│   │   └── app-providers.tsx       # All providers combined
│   └── types/
│       └── global.types.ts         # Global type definitions
│
├── features/                       # Feature modules
│   ├── characters/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── favorites/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── types/
│   └── comments/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── pages/                          # Route-level components
│
├── shared/                         # Shared across features
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── pwa/
│   ├── hooks/
│   ├── utils/
│   └── constants/
│
├── styles/
│   └── tailwind.css                # Tailwind v4 config
│
├── App.tsx
└── main.tsx
```

## PWA Setup

The app is configured as a Progressive Web App with:

1. **Manifest**: Complete web app manifest with all required icons
2. **Service Worker**: Workbox-powered SW with smart caching strategies
3. **Offline Support**: API responses and images cached for offline use
4. **Update Strategy**: Automatic updates with user notification
5. **Install Prompt**: Custom UI for installation on mobile/desktop

### Cache Strategies

- **API Calls**: Network First (10s timeout, falls back to cache)
- **Images**: Cache First (100 entries, 30 days expiration)
- **Fonts**: Stale While Revalidate
- **Static Assets**: Pre-cached during install

## Browser Support

- Chrome/Edge 111+
- Safari 16.4+
- Firefox 128+

## License

MIT
