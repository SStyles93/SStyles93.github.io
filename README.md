# Project Setup

This project uses **Astro** with **pnpm**.

## Prerequisites

### 1. Install Node.js

Download and install the latest LTS version of Node.js:

https://nodejs.org/

Verify the installation:

```bash
node -v
npm -v
```

---

### 2. Install pnpm

Using Windows Package Manager:

```powershell
winget install -e --id pnpm.pnpm
```

Verify the installation:

```powershell
pnpm --version
```

---

### 3. Allow PowerShell Scripts (Windows)

If PowerShell displays an error similar to:

```
running scripts is disabled on this system
```

Run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Confirm with **Y** when prompted.

---

## Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

## Install Dependencies

```powershell
pnpm update
pnpm upgrade
```

Alternatively, if this is a fresh clone and `node_modules` does not exist, you can simply run:

```powershell
pnpm install
```

---

## Run the Development Server

```powershell
pnpm run dev
```

Astro will start a local development server, typically available at:

```
http://localhost:4321
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install project dependencies |
| `pnpm update` | Update packages according to `package.json` |
| `pnpm upgrade` | Upgrade dependencies to newer compatible versions |
| `pnpm run dev` | Start the development server |
| `pnpm run build` | Build the project for production |
| `pnpm run preview` | Preview the production build locally |

---

## Updating the Project

After pulling new changes from GitHub:

```powershell
git pull
pnpm update
pnpm upgrade
```

If dependencies have changed significantly, you can instead run:

```powershell
pnpm install
```

---

## Troubleshooting

### PowerShell: Running scripts is disabled

Run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### `pnpm` is not recognized

Make sure pnpm is installed:

```powershell
winget install -e --id pnpm.pnpm
```

Restart your terminal after installation.

### Check installed versions

```powershell
node -v
npm -v
pnpm --version
```
