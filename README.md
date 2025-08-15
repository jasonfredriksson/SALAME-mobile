# SALAME - Marketplace App

A marketplace application for buying and selling products in Argentina, built with Expo and React Native.

## Project Description

SALAME is a cross-platform marketplace application that supports both mobile (iOS/Android) and web platforms. The app provides features for users to buy, sell, and manage products with a modern and intuitive interface.

## Features

- Browse products by category
- Product details with images and descriptions
- User chat functionality
- Offer management system
- Checkout process
- User profile management
- Product publishing workflow

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd SALAME
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Mobile App

There are several ways to run the mobile application:

1. **Simple launcher**:
   ```
   npm run dev
   ```
   or use the provided batch file:
   ```
   start-mobile.bat
   ```

2. **Full mobile demo**:
   ```
   launch-salame-mobile.bat
   ```

This will start the Expo development server. You can then:
- Run on an iOS simulator (Mac only)
- Run on an Android emulator
- Scan the QR code with the Expo Go app on your physical device

### Web Version

To build and run the web version:

```
npm run build:web
```

## Development Scripts

- `npm run dev` - Start the Expo development server
- `npm run build:web` - Build the web version of the application
- `npm run lint` - Run linting checks

## Project Structure

- `/app` - Main application code organized by routes (using Expo Router)
- `/assets` - Static assets such as images and fonts
- `/components` - Reusable React components
- `/data` - Mock data and data utilities
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions
- `/utils` - Utility functions

## License

[Your license information here]
