# PCOUNT - Production Monitoring Application

## Overview
PCOUNT is a React Native web application built with Expo for production line monitoring and counting. The application provides a comprehensive dashboard for tracking production statistics, managing production lines, and monitoring manufacturing processes. It features a contract-based workflow where users authenticate, select a contract, and then access production monitoring tools through a tabbed interface.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Expo React Native (~54.0.7) configured for web deployment
- **Language**: TypeScript with strict type checking and react-jsx transform
- **Styling**: Styled Components for React Native with a centralized theme system
- **Navigation**: React Navigation v7 with nested navigation (Stack + Bottom Tabs)
  - Stack Navigator for authentication flow (Login → Contract Selection → Main App)
  - Bottom Tab Navigator for main features (Dashboard, Lines, Production)
- **State Management**: React Context API for authentication state and user session management
- **UI Components**: Custom styled components with consistent theming and responsive design

### Authentication & Authorization
- **Authentication**: Context-based authentication with mock user validation
- **Default Credentials**: Admin/Admin for demonstration purposes
- **User Roles**: Admin and operator roles with different access levels
- **Session Flow**: Login → Contract Selection → Main Application Access
- **Contract System**: Multi-contract support requiring selection before accessing production data

### Data Architecture
- **Data Storage**: Mock data files for demonstration (users, contracts, production lines, productions)
- **Type Safety**: Comprehensive TypeScript interfaces for all data models
- **Data Models**:
  - User management with roles and authentication
  - Contract management with company associations
  - Production line tracking with status monitoring
  - Production records with technician assignments and timestamps
  - Real-time production statistics and metrics

### Component Architecture
- **Styled Components**: Centralized styling system with theme-based design tokens
- **Reusable Components**: Modular UI components (Container, Card, Button, Input, etc.)
- **Screen Components**: Feature-specific screens with navigation integration
- **Custom Charts**: SVG-based chart components for production data visualization

### Development & Build Configuration
- **Metro Bundler**: Custom configuration for multi-platform support (iOS, Android, Web)
- **TypeScript**: ES2020 target with modern module resolution
- **Web Platform**: React Native Web for browser compatibility
- **Asset Management**: Expo asset pipeline with hashing for production builds

## External Dependencies

### Core Framework Dependencies
- **Expo SDK**: Complete development platform for React Native applications
- **React Navigation**: Navigation library with stack and tab navigation support
- **React Native Screens**: Native navigation performance optimization
- **React Native Safe Area Context**: Safe area handling for different device types

### UI & Styling Dependencies
- **Styled Components**: CSS-in-JS styling solution for React Native
- **React Native Vector Icons**: Icon library for UI elements
- **React Native SVG**: SVG rendering for custom charts and graphics
- **Expo Linear Gradient**: Gradient support for enhanced UI design

### Development Dependencies
- **TypeScript**: Static type checking and enhanced development experience
- **Expo Metro Config**: Build system configuration and optimization

### Production Dependencies
- **React Native Web**: Web platform support for browser deployment
- **Serve**: Static file server for production web deployment

### Deployment Configuration
- **Build Target**: Web platform with static file generation
- **Production Server**: Serve package for static file hosting
- **Port Configuration**: Dynamic port binding for cloud deployment environments
- **Asset Optimization**: Expo's built-in asset optimization and bundling