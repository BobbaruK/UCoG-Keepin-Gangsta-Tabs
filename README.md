# City of Gangsters: Keepin' Gangsta Tabs

This repository is built on top of [auth-v3 v1.0.0](https://github.com/BobbaruK/auth-v3/releases/tag/v1.0.0)

## Table of Contents

- [Tech Stack](#tech-stack-and-important-packages)
- [Overview](#overview)
- [Server Setup](#server-setup)
  - [Development](#development)
  - [Production](#production)
  - [Production without multi staging](#production-without-multi-staging)
- [Commit Message Guidelines](#commit-message-guidelines)
  - [Commit Types](#commit-types)
  - [Examples](#examples)
  - [Notes](#notes)
- [Backup and restore postgres databases in docker](#backup-and-restore-postgres-databases-in-docker)
  - [Backup](#backup)
    - [gzip](#gzip)
    - [brotli or bzip2](#brotli-or-bzip2)
  - [Restore](#restore)

## Tech Stack and Important Packages

### Core

- **next** – Full-stack React framework (SSR, SSG, routing).
- **react / react-dom** – React 19 UI library and DOM renderer with concurrent features.

### Database

- **prisma / @prisma/client** – Type-safe ORM for PostgreSQL, with support for schema migrations and query building.
- **@prisma/extension-accelerate** – Prisma Accelerate extension for improved query performance and caching.

### Forms & Validation

- **react-hook-form** – Lightweight form management for React.
- **@hookform/resolvers** – Connects schema validation libraries (e.g., Zod) to React Hook Form.
- **zod** – TypeScript-first schema validation and parsing.

### UI & Styling

- **tailwindcss** – Utility-first CSS framework for rapid styling (v4).
- **@tailwindcss/typography** – Tailwind plugin for rich text content styling.
- **tailwind-merge** – Safely merge and override Tailwind classes.
- **clsx** – Utility for conditional class concatenation.
- **class-variance-authority (CVA)** – Variant management for component styling.
- **shadcn/ui** – Accessible, headless UI components built on top of Radix primitives.
- **@radix-ui/react-\*** – Unstyled accessible components (dialog, dropdown, tabs, etc.).
- **lucide-react / react-icons** – Icon libraries providing scalable SVG icons.
- **tw-animate-css** – Tailwind plugin for CSS-based animations.
- **vaul** – Accessible drawer components for modern UIs.
- **sonner** – Beautiful toast notifications for React.

### Auth & Security

- **better-auth** – Authentication library supporting cookies, JWT, and advanced user management flows.
- **input-otp** – Ready-to-use OTP input components for authentication screens.

### Theming & Utilities

- **next-themes** – Manage dark/light mode and custom themes in Next.js.
- **usehooks-ts** – Collection of reusable React hooks written in TypeScript.
- **nuqs** – URL state management hooks for query parameters.
- **ua-parser-js** – User-Agent parser for device and browser detection.

### Email

- **resend** – API for sending transactional emails.
- **@react-email/components / @react-email/render / react-email** – Build, render, and preview emails using React components.

### Development & Linting

- **typescript** – Strongly typed JavaScript for better tooling and maintainability.
- **eslint / eslint-config-next / eslint-plugin-boundaries** – Linting, code quality, and project structure enforcement.
- **prettier / prettier-plugin-tailwindcss** – Code formatting with Tailwind class sorting.

## Overview

**City of Gangsters: Keepin' Gangsta Tabs** is a management and analytics application inspired by the original [_CoG Keepin' Tabs_](https://docs.google.com/spreadsheets/d/1DKPZZGBiUxe5LUMHHTFIu3OC6S6epgayfZsBdvj2S-Q/edit?gid=681172877#gid=681172877) tracking spreadsheet. More info [here](https://cityofgangsters.traxy.co.uk/).

The goal of this project is to transform the extensive data and relationships from the Google Sheets version into a real, structured database with a modern web interface built using **Next.js**.

The app centralizes information about cities, businesses, production chains, resources, and economic activities — providing a dynamic and intuitive way to explore, update, and analyze in-game data.

It replaces most of manual spreadsheet work with an automated, scalable system that supports sorting, filtering, and cross-referencing between entities.

This project aims to bring structure, speed, and interactivity to the _City of Gangsters_ experience — keeping it _gangsta_, but organized.

...and remember, you can't be half a gangster.

## Server Setup

### Development

To start the development server:

```bash
docker compose -f compose.dev.yaml up --watch
```

Alternatively, you can run only the Postgres container with Docker and start the Next.js app locally:

```bash
docker compose -f compose.dev.yaml up db -d
cd ./next-app
npx prisma db push # or npx prisma generate
npm run dev
```

### Production

To start the production server:

```bash
docker compose -f compose.prod.yaml up
```

### Production without multi staging

To start the production without multi staging server:

```bash
docker compose -f compose.prod-without-multistage.yaml up
```

## Commit Message Guidelines

This project follows the **Conventional Commits** convention to keep a clean and consistent commit history.

Each commit message should have the following format:

### Commit Types

- **chore** → maintenance tasks, not affecting application logic (e.g. config, cleanup)
- **docs** → documentation changes (README, guides, comments)
- **style** → code formatting, not affecting functionality (indentation, spacing, semicolons)
- **feat** → a new feature (API endpoint, UI component, functionality)
- **fix** → a bug fix (UI bug, backend error, Prisma query fix)
- **refactor** → code changes that improve structure without changing behavior
- **test** → adding or updating tests (unit, integration, e2e)
- **build** → changes to build system (Next.js config, Webpack, Vite)
- **ci** → changes to CI/CD configuration (GitHub Actions, Docker workflows)
- **perf** → performance improvements (query optimization, caching, rendering optimization)
- **deps** → dependency updates (upgrade/downgrade libraries)
- **db** → database-related changes (Prisma migrations, seeds)
- **docker** → Docker-related changes (Dockerfile, docker-compose)

### Examples

`<type>(<scope>): <short description>`

- feat(auth): add JWT authentication
- fix(api): handle null values in user controller
- docs(readme): update installation steps
- refactor(db): extract prisma client initialization
- test(auth): add unit tests for login flow
- build(next): update next.config.js for standalone mode
- ci(docker): add GitHub Action for building Docker image
- perf(prisma): optimize query with select and include
- deps(prisma): update prisma to v5
- db(migration): add new table for orders
- docker(compose): add volume for postgres persistence

### Notes

- Keep messages **short and clear**
- Use **English** for consistency
- Use **imperative mood**: "add feature" not "added feature"
- When in doubt, prefer **feat** or **fix**, and add a clear scope

## Backup and restore postgres databases in docker

### Backup

All DBs

```sh
docker exec -t your-db-container pg_dumpall -c -U db_user > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql
```

Specific DB

```sh
docker exec -t your_db_container pg_dump -U db_user db_name --clean > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql
```

### gzip

All DBs

```sh
docker exec -t your-db-container pg_dumpall -c -U db_user | gzip > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

Specific DB

```sh
docker exec -t your-db-container pg_dump -U db_user db_name | gzip > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

### brotli or bzip2

All DBs

```sh
docker exec -t your-db-container pg_dumpall -c -U db_user | brotli --best > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.br
```

Specific DB

```sh
docker exec -t your-db-container pg_dump -U db_user db_name | brotli > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

All DBs

```sh
docker exec -t your-db-container pg_dumpall -c -U db_user | bzip2 --best > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.bz2
```

Specific DB

```sh
docker exec -t your-db-container pg_dump -U db_user db_name | bzip2 > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

### Restore

All DBs

```sh
cat your_dump.sql | docker exec -i your-db-container psql -U db_user
```

Specific DB

```sh
cat your_dump.sql | docker exec -i your-db-container psql -U db_user -d db_name
```
