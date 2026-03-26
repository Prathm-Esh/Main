# Learn With PM

A professionally structured Angular application with a JWT-based login flow, route protection, and feature-first architecture.

## Overview

- App name: `Learn With PM`
- Framework: Angular (standalone components)
- Authentication: temporary credentials + generated JWT token
- Authorization: protected dashboard route using an auth guard
- Storage: JWT persisted in `localStorage`

## Temporary Login Credentials

Use these credentials on the login screen:

- User ID: `pmuser`
- Password: `PM@12345`

## Route Structure

- `/auth/login` - login page
- `/dashboard` - protected dashboard page (requires valid session)
- `/` - redirects to `/auth/login`

## Project Architecture

```text
src/
  app/
    core/
      constants/
        auth.constants.ts
      guards/
        auth.guard.ts
      models/
        auth.models.ts
      services/
        auth.service.ts
        token-storage.service.ts
    features/
      auth/
        pages/
          login/
            login-page.component.ts
            login-page.component.html
            login-page.component.css
      dashboard/
        pages/
          dashboard/
            dashboard-page.component.ts
            dashboard-page.component.html
            dashboard-page.component.css
    app.config.ts
    app.routes.ts
    app.ts
    app.html
    app.css
```

## Authentication Flow

1. User submits credentials on `/auth/login`.
2. `AuthService` validates credentials using constants from `auth.constants.ts`.
3. On success, a JWT-like token is generated and saved using `TokenStorageService`.
4. User is redirected to `/dashboard`.
5. `auth.guard.ts` blocks unauthorized access to `/dashboard`.
6. Session is restored from token on refresh if token is valid and not expired.

## Run Locally

```bash
npm install
npm start
```

App runs at: `http://localhost:4200`

## Build

```bash
npm run build
```

## Run Tests

```bash
npm test
```

## Notes

- Current JWT generation is for demo/development usage.
- For production, replace temporary credential checks with backend API authentication.
- Recommended next step: add HTTP interceptor to attach bearer token to API requests.
