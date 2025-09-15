# PCOUNT - Production Monitoring Application

## Overview
PCOUNT is a React Native web application built with Expo for production line monitoring and counting. The application provides a dashboard for tracking production statistics, managing production lines, and monitoring production data.

## Project Architecture
- **Framework**: Expo React Native (configured for web)
- **Language**: TypeScript
- **Navigation**: React Navigation with bottom tabs and stack navigation
- **Styling**: Styled Components with React Native
- **State Management**: React Context API for authentication
- **Development Server**: Expo Metro bundler on port 5000

## Recent Changes (September 15, 2025)
1. Fixed TypeScript configuration to support JSX compilation
2. Configured development workflow for Expo web on port 5000
3. Set up deployment configuration for production (autoscale)
4. Added serve package for production static file serving
5. Verified application runs correctly in Replit environment

## Application Features
- **Authentication**: Login system with Admin/Admin default credentials
- **Dashboard**: Production statistics and metrics display
- **Production Lines**: Management and monitoring of production lines
- **Contract Management**: Multi-contract support with selection flow
- **Responsive Design**: Optimized for web deployment

## Development Setup
- Development server runs on port 5000 using `npx expo start --web --port 5000`
- TypeScript configuration supports JSX with react-jsx transform
- Metro bundler handles module resolution and bundling
- Application uses React Native Web for web compatibility

## Deployment Configuration
- **Target**: Autoscale (stateless web application)
- **Build**: `npx expo export --platform web` (creates optimized build)
- **Run**: `npx serve -s dist -l $PORT` (serves static files on dynamic port)
- **Dependencies**: serve package installed for production deployment

## User Preferences
- Default login credentials: Admin/Admin
- Portuguese language interface
- Production-focused UI design
- Tab-based navigation for main features

## File Structure
- `/src/screens/`: Application screens (Login, Dashboard, Production, etc.)
- `/src/components/`: Reusable styled components
- `/src/contexts/`: React Context providers (Auth)
- `/src/data/`: Mock data for users, contracts, production lines
- `/src/navigation/`: React Navigation configuration
- `/src/types/`: TypeScript type definitions
- `/assets/`: Application icons and images