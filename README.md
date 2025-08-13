# Tadado App

A mobile application built with React Native and Expo.

## Project Structure

The project has been reorganized for better maintainability and cleaner code structure:

### Components

Components are now organized by their purpose:

- `components/common/`: Reusable UI components like ThemedText and ThemedView
- `components/forms/`: Form-related components like LanguageSelector
- `components/layout/`: Layout components like HapticTab and TabBarBackground
- `components/ui/`: UI components specific to the app like AICard, GameCard, etc.

### Hooks

Custom hooks are organized by functionality:

- `hooks/useColorScheme.ts`: Hook for handling color scheme
- `hooks/useThemeColor.ts`: Hook for theme colors
- `hooks/useUsernameCheck.ts`: Hook for username availability checking

### Contexts

- `contexts/AuthContext.tsx`: Authentication context
- `contexts/LanguageContext.tsx`: Language/translation context

### i18n

Internationalization support with translations for:

- English
- Turkish
- German

## Recent Cleanup Changes

The following changes were made to improve code quality and maintainability:

1. **Removed unused components**:
   - HelloWave
   - ParallaxScrollView
   - Collapsible
   - RomanceCard
   - TravelCard
   - ExternalLink

2. **Removed empty directories**:
   - database/
   - src/
   - examples/

3. **Reorganized folder structure**:
   - Created logical groupings for components
   - Updated imports across the project

4. **Simplified hooks**:
   - Split useUsers.ts into a focused useUsernameCheck.ts

5. **Ensured all text uses translations**:
   - Added missing translation keys
   - Updated components to use translation functions

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```