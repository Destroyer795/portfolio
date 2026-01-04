This repository contains the source code for my personal portfolio website. It is designed with a focus on **performance**, **minimalism**, and **architectural aesthetics**. Built using [Astro](https://astro.build) for zero-JS by default performance and [Tailwind CSS](https://tailwindcss.com) for styling.

## Design

The design moves away from standard portfolio tropes, opting for a **"System Spec"** aesthetic:
* **Typography:** Monospace headers combined with clean Sans-Serif body text.
* **Layout:** Grid-based "Architectural" layouts rather than floating cards.
* **Theme:** High-contrast Dark/Light mode with grainy gradients and "Northern Light" atmospheric effects.
* **Navigation:** Directory-style routing (`hello_world.py`, `/projects`) over generic buttons.

## Tech Stack

* **Framework:** [Astro](https://astro.build/) (Static Site Generation)
* **Styling:** Tailwind CSS
* **Interactivity:** Vanilla JS & React (for complex interactive islands)
* **Icons:** Heroicons / Phosphor Icons (SVG)
* **Deployment:** Vercel / Netlify

## Project Structure

```text
/
├── public/           # Static assets (images, resumes, icons)
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── layout/   # Navbar, Footer, Head
│   │   └── sections/ # Hero, Skills, Projects, Experience
│   ├── layouts/      # Main HTML wrapper (Layout.astro)
│   ├── pages/        # Route definitions (index.astro)
│   └── styles/       # Global CSS and Tailwind directives
└── package.json
```

## Commands

All commands are run from the root of the project, from a terminal:

| Action | npm | pnpm |
| :--- | :--- | :--- |
| **Installs dependencies** | `npm install` | `pnpm install` |
| **Starts local dev server** at `localhost:4321` | `npm run dev` | `pnpm dev` |
| **Build your production site** to `./dist/` | `npm run build` | `pnpm build` |
| **Preview your build** locally, before deploying | `npm run preview` | `pnpm preview` |
| **Run CLI commands** like `astro add`, `astro check` | `npm run astro ...` | `pnpm astro ...` |
| **Get help** using the Astro CLI | `npm run astro -- --help` | `pnpm astro --help` |

