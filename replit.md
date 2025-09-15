# PCOUNT - Production Monitoring Application

## Overview

PCOUNT is a React Native production monitoring application built with Expo, designed for tracking and managing production lines. The application provides real-time monitoring capabilities, production statistics, and multi-contract support with a web-optimized responsive design. It features a dashboard with production metrics, line management, and QR code scanning functionality for production selection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Expo React Native with web platform support via react-native-web
- **Language**: TypeScript with strict mode enabled for type safety
- **Navigation**: React Navigation v7 with hybrid stack and bottom tab navigation
- **Styling**: Styled Components for React Native providing theme-based component styling
- **State Management**: React Context API for authentication and global state
- **UI Components**: Custom styled components with consistent theming system

### Authentication Flow
- **Method**: Simple credential-based authentication with mock user validation
- **Default Credentials**: Admin/Admin for demonstration purposes
- **Flow**: Login → Contract Selection → Main Application (Tab Navigation)
- **Context**: Global authentication state managed through React Context

### Navigation Structure
- **Conditional Rendering**: Authentication-based navigation switching
- **Main Flow**: Bottom tab navigator with Dashboard, Lines, and Production screens
- **Secondary Navigation**: Stack navigation for detailed views (LineDetail screen)
- **Route Protection**: Automatic redirection based on authentication and contract selection state

### Component Architecture
- **Design System**: Centralized theme configuration with colors, fonts, spacing, and shadows
- **Styled Components**: Reusable styled components following design system principles
- **Responsive Design**: Screen dimension-aware components for web deployment
- **Custom Charts**: SVG-based chart components for production statistics visualization

### Data Management
- **Mock Data**: Static data files for users, contracts, production lines, and statistics
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Separation of Concerns**: Data layer separated from presentation components

### Cross-Platform Configuration
- **Metro Bundler**: Configured for multi-platform support (iOS, Android, web)
- **Asset Handling**: Expo asset pipeline with hash-based file naming
- **Platform Detection**: Platform-specific configurations and optimizations

## External Dependencies

### Core Framework Dependencies
- **Expo SDK 54.0.7**: Cross-platform development framework and build system
- **React 19.1.0**: Core React library with latest JSX transform
- **React Native 0.81.4**: Native mobile development framework
- **React DOM 19.1.0**: Web rendering support

### Navigation Dependencies
- **@react-navigation/native 7.1.17**: Core navigation library
- **@react-navigation/native-stack 7.3.26**: Stack navigation implementation
- **@react-navigation/bottom-tabs 7.4.7**: Bottom tab navigation component
- **react-native-screens 4.16.0**: Native screen management optimization
- **react-native-safe-area-context 5.6.1**: Safe area handling for different devices

### UI and Styling Dependencies
- **styled-components 6.1.19**: CSS-in-JS styling solution for React Native
- **react-native-vector-icons 10.3.0**: Icon library with multiple icon sets
- **react-native-svg 15.12.1**: SVG rendering for custom charts and graphics
- **expo-linear-gradient 15.0.7**: Gradient component support
- **expo-status-bar 3.0.8**: Status bar configuration management

### Web Platform Dependencies
- **react-native-web 0.21.0**: React Native to web compilation layer
- **serve 14.2.5**: Static file server for production deployment

### Development Dependencies
- **TypeScript 5.9.2**: Static type checking and development tooling
- **@types/react 19.1.0**: React TypeScript type definitions
- **@types/react-native-vector-icons 6.4.18**: Vector icons TypeScript definitions
- **@types/styled-components-react-native 5.2.5**: Styled components TypeScript definitions

### Development and Build Tools
- **Expo CLI**: Development server and build tooling
- **Metro Bundler**: JavaScript bundler with React Native support
- **TypeScript Compiler**: Type checking and JavaScript compilation