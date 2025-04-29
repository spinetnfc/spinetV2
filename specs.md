# SPINET Web Application Specifications

## Overview

SPINET Web is a digital business card platform that allows users to create and manage their professional profiles.

## Features

### User Authentication

- Users can log in with email/password
- Session management using cookies

### Profile Management

- Users can view and edit their profile information
- Profile data is fetched from the API using the `getProfile` function
- Profile data is updated with the `updateProfile` function
- Profile data includes:
  - Personal information (first name, last name, birth date, gender)
  - Professional information (company name, activity sector, position)
  - Profile theme and styling
  - Social links
  - Feature access/restrictions

### Profile Page Implementation

- The profile page fetches real user data from the API
- Fallback/default data is shown if API request fails
- UI adapts to show locked/unlocked features based on user's subscription
- Profile avatar and cover images are loaded dynamically when available
- Theme colors are applied from the user's preferences
- Social links are displayed and can be edited if allowed
- Form submission handled by client components with proper user feedback
- Different forms for different profile sections (personal, security, preferences)
- Form validation using Zod schema validation
- Calendar component for date selection instead of basic date input
- Dynamic form fields for social links with add/remove functionality

## Code Organization

### API Calls

- API functions are organized in the `lib/api` directory
- `profile.ts` - Contains functions for fetching and updating profile data
  - `getProfile` - GET request to fetch user profile data
  - `updateProfile` - PUT request to update user profile data

### Page Structure

- Internationalization implemented with locale in URL path (`[locale]`)
- Protected routes are in the `(protected)` directory
- Server components fetch data, client components handle interactivity
- Form components are client-side with validation

## Styling and UI

- Using Tailwind CSS for styling
- Using shadcn/ui components
- Responsive design with mobile-first approach
- Dynamic styling based on user preferences (theme color)

## Dependencies

- Next.js for the framework
- React for UI
- Lucide for icons
- Tailwind CSS for styling
- Zod for form validation
- React Hook Form for form state management
- date-fns for date formatting and manipulation

## Coding Conventions

- TypeScript for type safety
- Async/await for asynchronous operations
- Error handling with try/catch blocks
- Server components for data fetching
- Client components for interactivity when needed
- Form-based updates with FormData API
- Schema validation for form inputs
- Toast notifications for user feedback

## Authentication

### Token Refresh

- Implemented automatic token refresh mechanism in the authentication context
- Token refresh occurs every 30 minutes for logged-in users
- Manual token refresh available through `refreshUserToken` function
- Login page attempts token refresh on mount
- Refresh token endpoint: `/auth/refresh`
- Response format:
  ```typescript
  {
    success: boolean;
    user?: {
      _id: string;
      email: string;
      tokens: {
        fileApiToken: string;
        fileApiRefreshToken: string;
      }
    }
  }
  ```

### Login Flow

- User enters credentials
- On successful login:
  - User data stored in cookies
  - File API tokens stored in cookies
  - User redirected to home page
- On failed login:
  - Error message displayed
  - User can retry

### Protected Routes

- All routes under `[locale]/(protected)` require authentication
- Unauthorized users redirected to login page
- Token refresh attempts made before redirecting

## Libraries Used

- React Context API for state management
- React Hook Form for form handling
- Zod for validation
- React Intl for internationalization
- Sonner for toast notifications
- Lucide React for icons
