# Rick and Morty Character Explorer

> A modern, production-ready React application for exploring characters from the Rick and Morty universe. Built with TypeScript, GraphQL, and best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Tests](https://img.shields.io/badge/Tests-56%20passing-success)](./docs/testing.md)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the app running.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [Environment Variables](#-environment-variables)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features
- 🎯 **Character Explorer** - Browse 800+ Rick and Morty characters
- 🔍 **Advanced Filtering** - Filter by status, species, and gender
- ⭐ **Favorites System** - Mark and manage favorite characters
- 💬 **Comments** - Add personal notes to characters
- 🗑️ **Soft Delete** - Remove characters with restore capability
- 📱 **Fully Responsive** - Works on all devices
- 🎨 **Modern UI** - Built with TailwindCSS
- ⚡ **PWA Support** - Install as native app

### Technical Features
- ✅ **100% TypeScript** - Full type safety
- ✅ **GraphQL API** - Efficient data fetching with Apollo Client
- ✅ **56+ Unit Tests** - Comprehensive test coverage
- ✅ **SOLID Principles** - Clean, maintainable architecture
- ✅ **Atomic Design** - Reusable component structure
- ✅ **LocalStorage Persistence** - Data survives refreshes
- ✅ **Skeleton Loaders** - Smooth loading UX
- ✅ **Error Handling** - Retry logic with exponential backoff

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript 5.6** - Type safety
- **Vite 6** - Build tool & dev server
- **TailwindCSS 3** - Styling
- **React Router DOM 7** - Client-side routing

### Data & State
- **Apollo Client** - GraphQL client
- **Context API** - Global state management
- **LocalStorage** - Client-side persistence

### Testing
- **Vitest** - Test runner
- **Testing Library** - Component testing
- **56 Unit Tests** - Components, hooks, utils, integration

### Tools & Quality
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vite PWA** - Progressive Web App support

---

## 📁 Project Structure

```
rick-morthy/
├── src/
│   ├── core/                    # Core configuration
│   │   ├── config/              # Apollo, Router, PWA config
│   │   └── types/               # Global type definitions
│   ├── features/                # Feature-based modules
│   │   ├── characters/          # Character browsing & filtering
│   │   ├── comments/            # Comment system
│   │   ├── favorites/           # Favorites management
│   │   └── soft-delete/         # Soft delete functionality
│   ├── shared/                  # Shared utilities & components
│   │   ├── components/          # Reusable UI components
│   │   ├── constants/           # App constants
│   │   └── utils/               # Helper functions
│   ├── pages/                   # Route pages
│   └── test/                    # Test suites
│       ├── features/            # Feature tests
│       ├── integration/         # Integration tests
│       └── shared/              # Shared component tests
├── docs/                        # Documentation
│   ├── architecture.md          # Architecture overview
│   ├── api.md                   # GraphQL API docs
│   ├── testing.md               # Testing guide
│   └── deployment.md            # Deployment guide
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rick-morthy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed (default values work out of the box)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   
   Navigate to `http://localhost:5173`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run test suite in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint code linting |

---

## 🧪 Testing

The project includes a comprehensive test suite with **56 tests** covering:

- ✅ Component rendering & behavior
- ✅ Custom hooks & state management
- ✅ Utility functions & helpers
- ✅ Integration scenarios
- ✅ LocalStorage persistence

### Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test character-card
```

### Test Results
```
✅ 56/56 tests passing (100%)
✅ Components: 15 tests
✅ Hooks: 19 tests
✅ Utils: 13 tests
✅ Integration: 9 tests
```

For detailed testing documentation, see [docs/testing.md](./docs/testing.md)

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# GraphQL API Endpoint
VITE_API_GRAPHQL_ENDPOINT=https://rickandmortyapi.com/graphql

# Application Name
VITE_APP_NAME=Rick and Morty Explorer

# Enable PWA (optional)
VITE_ENABLE_PWA=true
```

All variables are type-safe through `src/vite-env.d.ts`

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Architecture Guide](./docs/architecture.md)** - System design & patterns
- **[API Documentation](./docs/api.md)** - GraphQL queries & mutations
- **[Testing Guide](./docs/testing.md)** - Testing strategy & examples
- **[Deployment Guide](./docs/deployment.md)** - Production deployment steps
- **[Contributing Guide](./docs/contributing.md)** - Development guidelines

---

## 🎯 Key Features Explained

### Character Explorer
Browse characters with:
- Pagination (20 per page)
- Real-time search
- Multi-criteria filtering
- Instant sorting (A-Z, Z-A)

### Favorites System
- Add/remove with one click
- Persistent across sessions
- Dedicated favorites view
- LocalStorage backed

### Comments
- Character-specific notes
- Timestamp tracking
- Edit & delete support
- Author attribution

### Soft Delete
- Non-destructive removal
- Restore capability
- Separate deleted view
- Permanent delete option

---

## 🏗 Architecture Highlights

### SOLID Principles
- **S**ingle Responsibility - Each component/module has one purpose
- **O**pen/Closed - Easy to extend without modification
- **L**iskov Substitution - Interfaces are properly abstracted
- **I**nterface Segregation - Atomic type definitions
- **D**ependency Inversion - High-level modules don't depend on low-level

### Design Patterns
- **Feature-based architecture** - Code organized by feature
- **Context pattern** - Centralized state management
- **Custom hooks** - Reusable business logic
- **Branded types** - Type-safe IDs
- **Atomic design** - Component hierarchy

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder
```

For detailed deployment instructions, see [docs/deployment.md](./docs/deployment.md)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/contributing.md) for:

- Code style guidelines
- Testing requirements
- Pull request process
- Development workflow

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Rick and Morty API** - [rickandmortyapi.com](https://rickandmortyapi.com)
- **Rick and Morty** - Created by Justin Roiland and Dan Harmon

---

## 📞 Support

For questions or issues:
- Open an [Issue](../../issues)
- Check [Documentation](./docs/)
- Review [FAQ](./docs/faq.md)

---

**Made with ❤️ using React + TypeScript**
