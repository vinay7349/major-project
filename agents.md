# agents.md – AI Interaction Guide

## 📁 Project Overview
- **Root**: `major-project/`
- **Backend** (Django REST Framework): `backend/`
  - Entry point: `manage.py`
  - Dependencies: `backend/requirements.txt`
  - Main app packages: `accounts`, `products`, `inventory`, `billing`, `recommendations`, `notifications`, `analytics`, `reviews`, `shopgenie`
- **Frontend** (React + Vite + Tailwind): `frontend/`
  - Entry point: `npm run dev` (Vite dev server on `http://localhost:3000`)
  - Key directories: `src/components/`, `src/context/`, `src/hooks/`, `src/layouts/`, `src/pages/`, `src/services/`
  - Config files: `vite.config.js`, `tailwind.config.js`, `postcss.config.js`

## 🚀 Running the Project
### Backend
```bash
cd backend
pip install -r requirements.txt   # install Python deps
python manage.py migrate           # apply migrations
python seed_data.py                # seed sample data (optional)
python manage.py runserver         # start server at http://127.0.0.1:8000
```
### Frontend
```bash
cd frontend
npm install                        # install Node deps
npm run dev                         # start Vite dev server at http://localhost:3000
```

## 🤖 How an AI Agent Should Interact
1. **Understand the entry points**
   - Backend commands run from the `backend/` directory using `manage.py`.
   - Frontend commands run from `frontend/` using `npm` scripts.
2. **File locations**
   - API implementations live under `backend/<app_name>/views.py` and `serializers.py`.
   - React components live under `frontend/src/components/`.
   - Global state lives in `frontend/src/context/` (Auth, Theme, Notification).
3. **Common tasks**
   - **Add a new API endpoint**: create view/serializer in the appropriate backend app, add route in `backend/shopgenie/urls.py`, and update `frontend/src/services/` with an Axios call.
   - **Create a new UI page**: add a component under `src/pages/`, update routing in `src/App.jsx` (or the relevant layout), and add any needed context/provider.
   - **Run tests**: backend – `python manage.py test`; frontend – `npm run test` (if Jest is configured).
4. **Naming conventions**
   - Python modules follow snake_case.
   - React components use PascalCase (`MyComponent.jsx`).
   - CSS utility classes are Tailwind‑based; custom classes live in `src/index.css`.
5. **Version control**
   - All source files are tracked; generated `node_modules/` and `venv/` are ignored.
   - Commit messages should be concise and prefixed with the affected layer (e.g., `backend: add product AI detection endpoint`).

## 📚 Helpful References
- **Backend**: see `backend/README.md` (if present) or Django docs for custom commands.
- **Frontend**: Vite config (`vite.config.js`), Tailwind setup (`tailwind.config.js`).
- **API Spec**: summarized in `README.md` under *⚡️ Backend REST API Endpoints Summary*.

## 🛠️ AI‑Specific Tips
- Use `view_file` to inspect any source file before editing.
- Use `run_command` with the appropriate `Cwd` (`backend` or `frontend`) for installing deps or running servers.
- When adding code, keep existing docstrings and comments untouched unless a change is required.
- For UI changes, prefer updating existing component files in `src/components/` rather than creating duplicate styles.
- If you need to generate mock UI images, invoke the `generate_image` tool with a descriptive prompt.

---
*This document is intended for AI agents to quickly understand project layout, typical commands, and conventions, enabling smoother automated assistance.*
