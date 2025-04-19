# Spinet Web Application Specification

## Project Overview

Spinet is a digital identity and networking platform that allows users to create, manage, and share their digital profiles through NFC devices, QR codes, and direct links. The platform supports businesses and individuals with contact management, lead generation, and digital identity solutions.

## Tech Stack

### Core Technologies

- **Next.js 15**: App Router for handling pages and routing
- **React 19**: UI library for building the frontend
- **TypeScript**: For type-safe JavaScript code
- **Tailwind CSS 4**: For utility-first styling

### Key Libraries

- **Internationalization**:

  - `react-intl`: For handling translations and localization
  - `@formatjs/intl-localematcher`: For locale detection and matching
  - `negotiator`: For content negotiation in HTTP requests

- **UI Components**:

  - `lucide-react`: Icon library
  - `@radix-ui/*`: Low-level UI primitives (accordion, dialog, dropdown, etc.)
  - `class-variance-authority`: For creating component variants
  - `clsx` and `tailwind-merge`: For conditional className merging

- **Form Handling**:

  - `react-hook-form`: Form state and validation management
  - `zod`: Schema validation
  - `@hookform/resolvers`: Integration between react-hook-form and zod

- **Data Management**:

  - `@tanstack/react-query`: For server state management
  - `zustand`: For client-side state management

- **Carousel**:

  - `embla-carousel-react`: For carousel/slider components
  - `embla-carousel-autoplay`: For autoplay functionality in carousels

- **Animation**:

  - `tailwindcss-animate`: For Tailwind CSS animations

- **Utilities**:
  - `dayjs`: Date manipulation
  - `marked`: Markdown parsing
  - `nanoid`: Unique ID generation
  - `isomorphic-dompurify`: HTML sanitization
  - `next-themes`: For theme management (light/dark mode)

### Development Tools

- **Linting & Formatting**:

  - `eslint`: For code linting
  - `prettier`: For code formatting
  - Various eslint plugins for specific rule sets

- **Testing**:

  - `msw`: For mocking API requests

- **Build Tools**:
  - `plop`: For code generation
  - `husky`: For Git hooks
  - `lint-staged`: For running linters on staged files

## Project Architecture

### Directory Structure

```
src/
├── app/                   # Next.js App Router pages
│   └── [locale]/          # Locale-specific routes
├── components/            # React components
│   ├── icons/             # SVG icons as React components
│   ├── layouts/           # Layout components
│   ├── pages/             # Page-specific components
│   └── ui/                # Reusable UI components
├── config/                # Configuration files
├── features/              # Feature-specific modules
├── hooks/                 # Custom React hooks
├── lang/                  # Translation files (en.json, fr.json, ar.json)
├── lib/                   # Utility libraries and functions
├── mockdata/              # Mock data for development
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

### Routing Structure

The application uses Next.js App Router with internationalization support through route parameters:

- `/[locale]/` - Home page
- `/[locale]/profile` - User profile management
- `/[locale]/public-profile` - Public profile view
- `/[locale]/search` - Search functionality
- `/[locale]/shop` - E-commerce shop
- `/[locale]/auth` - Authentication pages
- `/[locale]/download-app` - App download information
- `/[locale]/app` - App-specific features

### Internationalization

The app supports multiple languages (English, French, Arabic) with locale-specific routing and RTL support for Arabic:

- Translation files stored in `src/lang/`
- Custom `useTranslate` hook for accessing translations
- Direction management for RTL support in Arabic UI
- Font family changes based on language (Poppins for Latin, Cairo for Arabic)

## UI Components and Design System

### Design Tokens

The project uses CSS variables for theming through Tailwind CSS:

- Color scheme variables (primary, secondary, accent, etc.)
- Typography scale with multiple font families
- Border radius and spacing scales
- Animation keyframes and durations

### Component Library

The UI is built with a mixture of custom components and Radix UI primitives:

- Buttons with multiple variants and states
- Form inputs with validation states
- Tabs, accordions, and dialogs
- Tables and data display components
- Notifications and alerts
- Modal dialogs and drawers
- Cards and containers

### Responsive Design

The application uses Tailwind's responsive classes with custom breakpoints:

- `xs`: 400px and up
- Default Tailwind breakpoints: sm, md, lg, xl, 2xl

## Features

### Core Features

1. **Digital Identity Management**

   - Profile creation and customization
   - Multiple profile support for different contexts
   - Social media integration
   - Contact information management

2. **NFC/QR Connectivity**

   - NFC card management
   - QR code generation
   - Profile sharing via links

3. **Contact Management**

   - Import/export contacts
   - Contact organization and grouping
   - Communication tracking

4. **Lead Management**

   - Lead capture and tracking
   - Follow-up reminders
   - Action management

5. **E-Commerce**

   - Product browsing and filtering
   - Shopping cart functionality
   - Checkout process

6. **Authentication System**

   - Login/signup flows
   - Password reset with OTP verification
   - Multi-factor authentication

7. **Team Collaboration**

   - Team management
   - Role-based permissions
   - Shared resources

8. **Event Management**
   - Event creation and management
   - Attendee tracking
   - Event analytics

### User Experience Features

1. **Multi-language Support**

   - English, French, and Arabic interfaces
   - RTL layout for Arabic

2. **Accessibility**

   - Semantic HTML
   - Keyboard navigation
   - Screen reader support

3. **Theming**

   - Light and dark mode support
   - Color scheme customization

4. **Responsive Design**
   - Mobile-first approach
   - Adaptive layouts for all screen sizes

## Coding Conventions

### TypeScript Patterns

- Strong typing for props and state
- Interface definitions for data models
- Type guards for conditional rendering
- Generics for reusable components and hooks

### Component Patterns

- Functional components with hooks
- Component composition for complex UIs
- Separation of concerns (presentation vs. logic)
- Props for component configuration
- Event handlers for user interactions

### State Management

- React Query for server state
- Zustand for global client state
- React hooks for local component state
- Context API for theme and localization state

### Naming Conventions

- **Files**: Kebab-case for component files (e.g., `user-profile.tsx`)
- **Components**: PascalCase for component names (e.g., `UserProfile`)
- **Functions**: camelCase for functions and methods
- **Variables**: camelCase for variables and props
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `UserProfileProps`)
- **Constants**: UPPER_SNAKE_CASE for unchanging values

### Code Organization

- Imports grouped by external libraries, then internal modules
- Component props defined with interfaces
- Components structured with state declarations first, then effects, then handlers, then rendering

## Performance Considerations

- Server-side rendering for initial page load
- Code splitting for route-based chunking
- Image optimization with Next.js Image component
- Fonts loaded with next/font for optimized delivery
- Minimal client-side JavaScript
- Efficient re-rendering with proper React patterns

## Deployment and Infrastructure

- Next.js deployment optimized for static and server-rendered pages
- Environment configuration for development and production
- API routes for server-side functionality
- Static asset optimization

## Security Features

- Content security with DOMPurify for sanitization
- Authentication with secure practices
- Form validation to prevent injection
- CSRF protection
- Secure HTTP headers

## Testing Strategy

- React Testing Library for component tests
- Mock Service Worker for API mocking
- Jest for unit testing
- E2E testing capability

## Future Development Considerations

- Progressive Web App (PWA) capabilities
- Enhanced analytics tracking
- Expanded language support
- Advanced team collaboration features
- Mobile app integration improvements
