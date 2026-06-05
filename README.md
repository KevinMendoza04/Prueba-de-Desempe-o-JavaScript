# SpaceBook — Workspace Reservation System

A Single Page Application (SPA) for managing workspace reservations within a company. Built with Vanilla JavaScript, Vite, TailwindCSS, and JSON Server.

---

## Description

SpaceBook allows employees to reserve shared company spaces (meeting rooms, private offices, coworking areas, and auditoriums) and administrators to manage all reservations and workspaces. The app implements role-based access control, session persistence, SPA routing with route guards, and full CRUD operations against a simulated REST API.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Vanilla JavaScript (ES6+) | Core application logic |
| Vite | Build tool and dev server |
| TailwindCSS v4 | Styling |
| JSON Server | Simulated REST API |
| Concurrently | Run Vite and JSON Server simultaneously |
| HTML5 / CSS3 | Markup and base styles |
| localStorage | Session persistence |
| History API | SPA routing |

---

## Installation

```bash
npm install
```

---

## Running the Project

```bash
npm run dev
```

This starts both the Vite development server and JSON Server concurrently:
- Vite: `http://localhost:5173`
- JSON Server (API): `http://localhost:3001`

---

## Running JSON Server Separately

```bash
npx json-server --watch db.json --port 3001
```

---

## Test Users

| Name | Email | Password | Role |
|---|---|---|---|
| Administrador | admin@test.com | A123456 | admin |
| Usuario | user@test.com | A123456 | user |
| Usuario 2 | user2@test.com | A123456 | user |

---

## Project Structure

```
src/
├── api/
│   └── http.js                     # Generic fetch wrapper (GET, POST, PUT, PATCH, DELETE)
├── assets/                         # Static assets
├── components/
│   ├── ReservationCard.js          # Reservation card with role-based action buttons
│   └── Sidebar.js                  # Navigation sidebar with logout and role-aware links
├── controllers/
│   ├── home.controller.js          # Loads reservations, handles approve/reject/cancel/delete
│   ├── login.controller.js         # Handles login form, credential validation, session save
│   ├── reservation.controller.js   # Create and edit reservation forms with business rules
│   └── workspaces.controller.js    # Admin CRUD for workspaces
├── router/
│   └── router.js                   # SPA router with auth and role guards
├── services/
│   ├── reservation.service.js      # API calls for reservations
│   └── workspace.service.js        # API calls for workspaces
├── views/
│   ├── accessDeniedView.js         # 403 access denied screen
│   ├── createReservationView.js    # New reservation form
│   ├── editReservationView.js      # Edit reservation form
│   ├── homeView.js                 # Dashboard with reservation list
│   ├── loginView.js                # Login screen
│   ├── notFound.js                 # 404 page
│   └── workspacesView.js           # Workspace management (admin only)
├── main.js                         # App entry point
├── style.css                       # TailwindCSS import
└── utils.js                        # Session helpers (save, get, remove, isAuthenticated, isAdmin)
```

---

## Role Permissions

### Admin

| Action | Allowed |
|---|---|
| View all reservations | ✅ |
| Create reservations | ✅ |
| Edit any reservation | ✅ |
| Delete any reservation | ✅ |
| Approve reservations | ✅ |
| Reject reservations | ✅ |
| Manage workspaces (CRUD) | ✅ |
| Access admin modules | ✅ |

### User

| Action | Allowed |
|---|---|
| View own reservations only | ✅ |
| Create reservations | ✅ |
| Edit own pending reservations | ✅ |
| Cancel own reservations | ✅ |
| View other users' reservations | ❌ |
| Approve / reject reservations | ❌ |
| Manage workspaces | ❌ |
| Access admin modules | ❌ |

---

## Technical Decisions

### SPA Routing with History API
The router uses `history.pushState` and listens to `popstate` to navigate without page reloads. Routes are defined as a plain object mapping paths to view functions with metadata (`requiresAuth`, `requiresAdmin`).

### Route Guards
The router evaluates two guards before rendering any view:
1. **Auth guard** — redirects unauthenticated users to `/` and authenticated users away from `/`.
2. **Role guard** — renders the `accessDeniedView` with a clear message when a `user` tries to access admin-only routes like `/workspaces`.

### Session Persistence
User data (id, name, role) is stored in `localStorage` after login. On every page load or navigation, `getSession()` reads from localStorage, keeping the session alive across browser refreshes. `removeSession()` clears it on logout.

### Controller Pattern
Views only return HTML strings and schedule controller initialization via `setTimeout(() => controller(), 0)`. This ensures the DOM is painted before attaching event listeners, avoiding `null` querySelector errors.

### Business Rules
- **No duplicate reservations**: before creating or editing, the app fetches all existing reservations and checks for time overlap on the same workspace and date (ignoring cancelled/rejected ones).
- **Edit restriction**: regular users can only edit their own `pending` reservations. The edit controller enforces this server-side check and renders an error message if violated.
- **Cancel vs delete**: users can cancel (status → `cancelled`), admins can physically delete (`DELETE /reservations/:id`).

### Denormalized workspace name
Reservations store both `workspaceId` (relational reference) and `workspace` (display name string). This avoids a second API call every time a reservation card is rendered, while still keeping the relational link for duplicate-check logic.

### Bugs Fixed from Base Project
| Bug | Fix |
|---|---|
| `Sidebar.js` logout didn't clear session | Added `removeSession()` call before `navigateTo("/")` |
| `reservation.service.js` exported `getReservation` (singular) but controller imported `getReservations` (plural) | Renamed export to `getReservations` |
| Router had no auth or role guards | Added guard logic in `router()` before rendering any view |
| `notFound.js` `#goHome` button had no event listener | Listener attached in `attachNotFoundListeners()` in the router |
