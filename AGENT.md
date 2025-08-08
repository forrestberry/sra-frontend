# SRA Web App Frontend

## Project Overview
- Vanilla JavaScript frontend application for SRA Reading Program
- Connects to Supabase backend using Supabase CDN client
- No framework dependencies (pure HTML/CSS/JS)
- Dockerized with Nginx for static file serving
- Environment variables injected at container startup
- Multi-user educational platform with parent/child roles

## Features
- **Parent Dashboard**: Manage multiple children, set reading levels
- **Child Dashboard**: Select books from 9 skill categories per level
- **Reading Interface**: Answer questions in units (25-50 units per book)
- **Progress Tracking**: Track completion, scores, and level advancement
- **Adaptive Learning**: Retry incorrect answers, advance when ready

## Development Commands

### Docker Development
```bash
# Start the application
docker-compose up --build

# Stop the application
docker-compose down

# View logs
docker-compose logs -f frontend

# Rebuild and restart
docker-compose up --build --force-recreate
```

### Local Development
- Serve files from any local HTTP server
- Application runs on port 8080 (Docker) or your local server port
- No build process required - direct HTML/JS execution

## Project Structure
```
frontend/
├── html/           # HTML pages (index.html, login.html, signup.html)
├── css/            # Stylesheets
├── js/             # JavaScript modules
│   ├── app.js      # Main application logic with auth flow
│   └── auth.js     # Authentication utilities (empty currently)
├── assets/         # Static assets
├── docker/         # Docker configuration
│   ├── Dockerfile          # Nginx-based container
│   ├── docker-entrypoint.sh # Environment variable injection
│   └── .dockerignore
├── env.js          # Environment configuration (exports SUPABASE_URL, SUPABASE_ANON_KEY)
├── .env            # Environment variables for Docker
├── .env.example    # Environment template
└── docker-compose.yml
```

## Environment Configuration
- Supabase configuration exported from `env.js`
- Environment variables injected via `docker-entrypoint.sh` script
- Local Supabase instance: `http://127.0.0.1:54321`
- Environment substitution at container startup using sed

### Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key

## Architecture Details
- **Client**: Supabase client loaded via CDN (`@supabase/supabase-js@2`)
- **Modules**: ES6 modules with explicit imports
- **Authentication**: Form-based signup/login with Supabase Auth
- **Routing**: Simple page-based navigation (no SPA routing)

## Code Conventions
- ES6 modules for JavaScript
- Extensive inline comments explaining JavaScript concepts
- Event-driven architecture with DOM event listeners
- Async/await for asynchronous operations
- No build step - direct browser execution
- Environment config exported from `env.js`

## Docker Details
- **Base Image**: `nginx:alpine`
- **Entrypoint**: Custom script that injects environment variables
- **Port**: 8080 (mapped to container port 80)
- **Volume**: Source code mounted for development

## Testing
- No automated test framework currently configured
- Manual testing through browser
- Use browser dev tools for debugging
- Test authentication flow with Supabase local instance

## Deployment
- Dockerized with Nginx for production
- Static file serving
- Environment variables injected at container startup
- No build process required

---

## UI Flows (Parent & Child)

Parent Flow
- Login/Signup (Supabase Auth) → Parent Dashboard
- Create Child: enter `name`, select `level` (Picture, Prep, A–H)
- Edit Child: update `name`/`level`, archive if needed
- Switch to Child View: select a child to operate as (stores `child_id` in memory)
- Monitor Progress: view per-child book and level progress

Child Flow (Operating under Parent Session)
- Child Dashboard: shows current `level` and 9 skill-category books
- Select Book: see units list and progress for the book
- Play Unit: answer 1–20 questions; submit to grade
- Redo Incorrect: redo only incorrect questions returned from grading
- Next Book/Level: when all books complete, advance to next level automatically (backend-driven)

Screens & Navigation
- `login.html` / `signup.html`: Auth forms; redirect to `index.html` after success
- `index.html` (Parent Dashboard): list of children, actions to add/edit, and a “Switch to Child” action
- Child Dashboard (section within `index.html`): visible after switch; shows level + books grid
- Book View (section or modal): lists units and shows per-unit status
- Unit Player (section or modal): renders questions; supports submit + redo
- Progress View (section): summaries by book and level

State & Persistence
- `session`: Supabase Auth session in memory (and local storage via supabase-js)
- `child_id`: stored in memory when switching to child view (cleared on logout)
- Progressive UI updates after each API call; no client-side DB

API Bindings (Edge Functions)
- Authenticated parent must pass `child_id` for child-specific actions
- Endpoints (subject to backend implementation):
  - `GET /children` → list children (parent-owned)
  - `POST /children` → create child `{ name, level_code }`
  - `PATCH /children/:id` → update child `{ name?, level_code? }`
  - `GET /levels` / `GET /skills` → metadata for UI
  - `GET /books?level=CODE` → books for level
  - `GET /units?book_id=...` → unit list
  - `GET /questions?unit_id=...` → unit questions (no answer_key)
  - `POST /responses` → submit answers for grading
  - `GET /progress/child/:id` → progress summary

Error Handling & UX
- Show inline errors for auth and API failures
- Disable submit while request in-flight; display spinners
- Preserve partially entered answers client-side until submitted

Environment Notes
- Requires `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Local dev typically uses `http://127.0.0.1:54321` for Supabase Edge Functions

Roadmap (Docs-Only)
- Add minimal components: children list, books grid, unit renderer
- Centralize API wrapper to attach `child_id` and auth automatically
- Accessibility pass: keyboard navigation and ARIA roles
