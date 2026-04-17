# AI Instructions (Ayaq Admin Panel)

## About the Project
This is the administrative panel for the **Ayaq** e-commerce application (a shoe store). The client side is a mobile app, and this project is the web interface for store management (products, orders, users, etc.).

## Tech Stack
- **Framework:** React (functional components, hooks)
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

## Core Code Generation Rules

### 1. Architecture and Project Structure
The project uses a classic React component architecture. It is **strictly forbidden** to break the existing logic and structure. 
Expected base folder structure inside `src/`:
- `/components` — reusable UI components (buttons, inputs, modals).
- `/pages` — page components (Dashboard, Orders, Products, etc.).
- `/api` — API request logic (configured axios instances, endpoints).
- `/hooks` — custom React hooks.
- `/utils` — helper functions and constants.
- `/assets` — static files (icons, images).

**Rule:** When creating new files, always place them in the appropriate directories. Strictly separate business logic from UI.

### 2. Design and UI/UX (Tailwind Style)
- When designing and laying out components, **always** refer to the instructions and guidelines in the `skills/frontend-design/SKILL.md` file. Read it before writing any UI code.
- **Style:** Minimalist, highly readable, and visually pleasing. Do not overload the interface with unnecessary details.
- Use sufficient whitespace/breathing room (`p-`, `m-`, `gap-` utilities).
- Adhere to a unified color palette (configured in `tailwind.config.js`).
- All components must be responsive.

### 3. API Handling & Implementation
- All API requests must be made exclusively through the `axios` library.
- **API Reference:** Before implementing any component that requires data, **you must read the API documentation in `docs/api/*.md`**. Connect the appropriate endpoints, use the correct request bodies, and handle the defined response structures.
- **Environment Variables:** All API base URLs must be stored in `.env` files. The primary backend endpoint must be referenced as `import.meta.env.VITE_BACKEND_API`.
- Create a base Axios instance configured with the base URL and use it for all requests.
- Always handle request errors (try/catch) and provide appropriate user feedback.

### 4. Code Quality
- Write clean, self-documenting code.
- Use modern JavaScript features (ES6+).
- Decompose large components into smaller ones if a file becomes too large (e.g., > 150-200 lines).
- Avoid deep conditional nesting (use early returns).

## Task Execution Instructions
1. Analyze the task and current architecture before writing any code.
2. **Consult API Docs:** Check `docs/api/` to identify the correct endpoints needed for the feature.
3. Check for existing UI components in the project to avoid code duplication.
4. Generate code strictly adhering to the styling rules (Tailwind + minimalism) and the recommendations from `SKILL.md`.
5. Ensure the newly added code does not break adjacent modules or the overall architecture.