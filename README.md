# PROJECT CONTEXT: User Registration System (IA03)

## 1. PROJECT OVERVIEW
Build a full-stack application including a **NestJS Backend** and a **React Frontend** for user registration and authentication.
**Goal:** Users can sign up (register) and log in via a responsive UI.

## 2. TECH STACK & PREFERENCES
### Backend
- **Framework:** NestJS (Strict TypeScript)
- **Database:** MongoDB (via Mongoose)
- **Auth:** Bcrypt for password hashing
- **Architecture:** Controller-Service-Repository pattern
- **Validation:** `class-validator` & `class-transformer`

### Frontend
- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (or generic clean CSS)
- **State/Async:** **TanStack Query (React Query)** (Strict requirement)
- **Forms:** **React Hook Form** (Strict requirement)
- **Routing:** React Router DOM

## 3. COPILOT / AI RULES OF ENGAGEMENT
When generating code, you MUST follow these rules:
1.  **Strict Types:** No `any`. Always define interfaces/DTOs for props, API responses, and state.
2.  **Error Handling:**
    - Backend: Use NestJS `HttpException` filters.
    - Frontend: Handle `isLoading` and `isError` states from React Query.
3.  **Clean Code:**
    - Keep components small and reusable.
    - Use Custom Hooks for logic separation.
4.  **Security:**
    - Never hardcode secrets. Use `ConfigService` (Backend) and `import.meta.env` (Frontend).
    - Hash passwords before saving.
5.  **Comments:** Add brief JSDoc comments for complex logic only.

---

## 4. DETAILED REQUIREMENTS

### A. BACKEND (NestJS)
**Database Schema (User):**
- `email`: String, required, unique.
- `password`: String, required (hashed).
- `createdAt`: Date, default to `Date.now`.

**API Endpoints:**
1.  **POST `/user/register`**
    - Validate input (`email`, `password`).
    - Check if `email` already exists -> Throw 409 Conflict.
    - Hash password using `bcrypt`.
    - Create User.
    - Return success message (e.g., `{ message: "User registered successfully", id: "..." }`).

**Configuration:**
- Enable **CORS** for Frontend communication.
- Use `.env` for `MONGO_URI`.

### B. FRONTEND (React)
**Routing Structure:**
1.  `/`: **Home Page** (Simple Welcome screen).
2.  `/login`: **Login Page** (UI only, mock success feedback).
3.  `/register`: **Sign Up Page** (Full logic).

**Feature - Sign Up Page:**
- Fields: Email, Password.
- Implementation:
    - Use `react-hook-form` for input handling.
    - Use `zod` (optional but recommended) for validation schema (Email format, password length).
    - Use `useMutation` (React Query) to call `POST /user/register`.
    - Show "Loading..." spinner during submission.
    - Show "Success" or "Error" toast/alert based on API response.

**Feature - Login Page:**
- UI Only (No backend logic required per specs).
- Fields: Email, Password.
- Action: On submit, simulate a delay and show a mock success message.

---

## 5. FOLDER STRUCTURE CONVENTION

```text
/root
  /backend (NestJS)
    /src
      /user
        dto/
        schemas/
        user.controller.ts
        user.service.ts
  /frontend (React)
    /src
      /components (ui elements)
      /pages (Home, Login, Register)
      /hooks (useRegister mutation)
      /api (axios instance)