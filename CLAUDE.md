# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a full-stack school management system (ISI - Institut Supérieur d'Informatique) with:

### Backend (Laravel 12)
- **Location**: `backend/` directory
- **Framework**: Laravel 12 with PHP 8.2+
- **Architecture**: Service-Repository pattern with API controllers
- **Database**: Uses Eloquent ORM with comprehensive migrations for school entities
- **Custom Commands**: 
  - `make:service` - Generates service classes with CRUD operations
  - `make:api-function` - Generates API controller methods

### Frontend (Angular 20)
- **Location**: `frontend/` directory  
- **Framework**: Angular 20 with TypeScript 5.8
- **UI Library**: PrimeNG with PrimeFlex and Tailwind CSS
- **Features**: SSR support, standalone components, complete CRUD interfaces

### Key Entities
The system manages typical school entities: Users, Specialites, Niveaux, Classes, Matieres, UEs, Notes, Absences, Inscriptions, AnneeScolaires, Semestres, Enseignements, Mentions, and Leparents.

## Common Development Commands

### Backend (Laravel)
```bash
cd backend

# Development server
php artisan serve

# Run tests
php artisan test
composer test

# Database operations
php artisan migrate
php artisan db:seed

# Generate services (custom command)
php artisan make:service ModelNameService

# Code style (Laravel Pint)
./vendor/bin/pint

# Full development stack (includes frontend)
composer dev
```

### Frontend (Angular)
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm start
# or
npx ng serve

# Build
npm run build

# Tests
npm test

# SSR build
npm run build:ssr

# Serve SSR
npm run serve:ssr
```

## IMPORTANT: Server Management

**⚠️ CRITICAL RULE: Always stop running servers before switching between frontend and backend work**

When working on this full-stack application:

1. **Before switching from backend to frontend work:**
   - Stop the Laravel server (Ctrl+C in the terminal running `php artisan serve`)
   - Then start the Angular development server (`npm start` in frontend directory)

2. **Before switching from frontend to backend work:**
   - Stop the Angular server (Ctrl+C in the terminal running `ng serve`)
   - Then start the Laravel server (`php artisan serve` in backend directory)

3. **If using the full development stack:**
   - Use `composer dev` from the backend directory which runs both servers simultaneously
   - This eliminates the need to manually switch between servers

**Why this matters:**
- Prevents port conflicts
- Avoids memory issues
- Ensures clean development environment
- Prevents confusion about which server is responding to requests

## Project Structure Highlights

### Backend API Routes
All API routes are versioned under `/api/v1/` prefix with resourceful controllers for each entity.

### Service Layer Pattern
Each model has a corresponding service class in `app/services/` that handles business logic with caching support.

### Frontend Architecture
- Complete CRUD interfaces for all entities
- Professional layout with responsive design
- Lazy-loaded routes for performance
- TypeScript models and services for type safety

## Development Workflow

1. **Backend First**: Set up database migrations and models
2. **Service Layer**: Create service classes using `make:service` command
3. **API Controllers**: Implement API endpoints in `app/Http/Controllers/V1/`
4. **Frontend Integration**: Build Angular components to consume the Laravel API
5. **Testing**: Use PHPUnit for backend, Jasmine/Karma for frontend

## Environment Setup

1. Copy `backend/.env.example` to `backend/.env` and configure database
2. Run `composer install` in backend directory
3. Run `npm install` in frontend directory
4. Set up database with `php artisan migrate` and `php artisan db:seed`
5. **Remember to manage servers properly** as outlined in the Server Management section above