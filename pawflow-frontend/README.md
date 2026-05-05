# Rahma Frontend - React + TypeScript + Vite

A modern pet care appointment booking platform built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components (routing)
├── services/      # API integration (axios)
├── store/         # State management (Zustand)
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── App.tsx        # Main app component
├── main.tsx       # Entry point
└── index.css      # Tailwind CSS
```

## 🔑 Features

- ✅ **Authentication**: Login/Register with JWT tokens
- ✅ **Dashboard**: User dashboard with pets and appointments
- ✅ **Booking Flow**: 4-step appointment booking process
- ✅ **Settings**: User profile and pet management
- ✅ **Admin Panel**: Admin dashboard for managing system
- ✅ **API Integration**: Connected with Flask backend

## 🛠️ Technologies

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6

## 📡 Backend Connection

The frontend is configured to connect to the Flask backend at `http://localhost:5000`

To configure a different backend URL, update `.env`:

```
VITE_API_URL=https://your-backend-url.com
```

## 🎨 Design

- Modern UI inspired by the original HTML designs
- Responsive design for mobile, tablet, and desktop
- Teal color scheme with Tailwind CSS
- DM Sans and Playfair Display fonts

## 📝 Development

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run linter

```bash
npm run lint
```

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. Token is automatically attached to API requests via Axios interceptors. If token expires (401 response), user is redirected to login.

## 📱 Supported Languages

- English (default)
- French (coming soon with i18n)
- RTL support planned

## 🤝 Contributing

This is part of the PawFlow/Rahma project. See main project README for contribution guidelines.

## 📄 License

All rights reserved © 2026 Rahma Pet Care
