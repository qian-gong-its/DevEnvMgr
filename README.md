# CLI TypeScript Starter Template

A production-oriented command line application template based on:

- Node.js
- TypeScript
- ESLint v9
- Prettier
- TSX
- ESM Modules

This template is intended for command line tools, automation scripts, developer utilities, configuration managers, deployment tools, and backend helper applications.

---

# Purpose

This template provides a clean foundation for building:

- CLI applications
- Automation tools
- Configuration management tools
- Deployment helpers
- File processing tools
- Developer productivity utilities

Example projects:

```text
Developer Environment Manager (DEM)
Deployment Management System Agent
Code Generators
Template Managers
Backup & Sync Tools
```

---

# Why This Template Exists

Frontend applications and backend APIs have different requirements than command line tools.

This template is specifically optimized for:

```text
Node.js Runtime
Filesystem Access
Path Management
OS Detection
Configuration Processing
Automation Tasks
```

Unlike Vite-based frontend projects, this template does not depend on a browser environment.

---

# Technology Stack

Runtime:

```text
Node.js
```

Language:

```text
TypeScript
```

Development Runner:

```text
TSX
```

Code Quality:

```text
ESLint
Prettier
```

Module System:

```text
ESM
```

---

# Development Workflow

## Install Dependencies

```bash
npm install
```

---

## Run Development Mode

```bash
npm run dev
```

Runs:

```text
src/main.ts
```

directly without generating JavaScript files.

Powered by:

```text
tsx
```

---

## Build

```bash
npm run build
```

Compiles TypeScript into:

```text
dist/
```

---

## Run Production Build

```bash
npm start
```

Runs:

```text
dist/main.js
```

---

## Code Quality

Lint source code:

```bash
npm run lint
```

Format source code:

```bash
npm run format
```

Run all checks:

```bash
npm run check
```

Recommended before commit.

---

# Project Structure

```text
.
├── src/
│   ├── config/
│   ├── logger/
│   ├── platform/
│   ├── utils/
│   │
│   └── main.ts
│
├── dist/
│
├── package.json
├── tsconfig.json
├── eslint.config.js
│
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .prettierrc
└── .prettierignore
```

---

# TypeScript Configuration

## Target

```json
"target": "ES2022"
```

Purpose:

- modern JavaScript output
- compatible with current Node.js versions
- avoids unnecessary transpilation

---

## Module

```json
"module": "NodeNext"
```

Purpose:

- native ESM support
- works with:

```json
"type": "module"
```

in package.json.

---

## Module Resolution

```json
"moduleResolution": "NodeNext"
```

Purpose:

- Node.js style module resolution
- compatible with ESM projects

---

## Node Types

```json
"types": ["node"]
```

Purpose:

Provides TypeScript definitions for:

```text
fs
path
os
process
Buffer
```

and other Node.js APIs.

---

# ESLint Configuration

This template uses:

```text
ESLint v9 Flat Config
```

with:

```text
@eslint/js
typescript-eslint
eslint-config-prettier
```

Goals:

- catch common mistakes
- support TypeScript
- avoid conflicts with Prettier

---

# Formatting

Formatting is handled by:

```text
Prettier
```

Recommended workflow:

```bash
npm run format
npm run check
```

before committing.

---

# Path Aliases

This template intentionally starts without runtime aliases.

Reason:

```text
Node CLI tools should remain simple.
```

For small projects:

```ts
import { logInfo } from './logger/logger.js';
```

is preferred.

Aliases can be introduced later if the project grows significantly.

---

# Recommended Use Cases

Use this template for:

- CLI tools
- configuration managers
- deployment tools
- automation scripts
- developer utilities
- file processing applications

Examples:

```text
DEM (Developer Environment Manager)
Template Generator
Config Synchronizer
Deployment Agent
Backup Tool
```

---

# Not Intended For

This template is not intended for:

```text
React Applications
Browser Applications
REST APIs
Express Servers
```

For those use:

```text
react-ts
node-ts
```

templates from this repository.

---

# Learning Path

This template belongs to the tooling and automation track:

```text
vanilla-js
     ↓
vanilla-ts
     ↓
cli-ts
     ↓
Developer Environment Manager
     ↓
Deployment Management System
```

---

# Notes

This template is the foundation for building tools.

Its primary focus is:

```text
Filesystem
Configuration
Automation
Developer Productivity
```

rather than UI development.
