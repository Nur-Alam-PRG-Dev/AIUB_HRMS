# AIUB HRMS — Human Resource Management System

A production-ready, full-stack Human Resource Management System developed for **American International University-Bangladesh (AIUB)**.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 (PHP 8.3+) |
| Frontend | Next.js 15 (JavaScript) |
| Database | MySQL 8+ |
| Auth | BetterAuth + Google OAuth 2.0 |
| Styling | Tailwind CSS v4 + DaisyUI |

## Modules

- **Employee Management** — Full CRUD, photo upload, department/designation management
- **Salary Management** — Salary structures, revisions, allowances & deductions
- **Payroll Management** — Monthly payroll generation, approval workflow, payslip PDF export
- **Leave Management** — Leave applications, approval, balance tracking
- **Attendance Tracking** — Daily attendance, monthly summaries
- **Role-Based Access Control** — Super Admin, HR Admin, Manager, Employee
- **Admin Panel** — User management, role assignment, activity logs

## Project Structure

```
AIUB_HRMS/
├── aiub_hrms_backend/          # Laravel 12 REST API
├── aiub_hrms_frontend/         # Next.js 15 App Router (JavaScript)
└── stitch_aiub_institutional_hrms/  # UI/UX reference theme
```

## Getting Started

### Backend

```bash
cd aiub_hrms_backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd aiub_hrms_frontend
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL and Google OAuth credentials
npm run dev
```

## Contributing

This project follows a feature-branch workflow.

1. Branch off from `main`: `git checkout -b feature/<your-username>/<feature-name>`
2. Make your changes with clear, atomic commits
3. Push and open a Pull Request against `main`
4. Request review before merging

## License

Internal academic project — AIUB, Dhaka, Bangladesh.
