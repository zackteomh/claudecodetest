# Allied MFG — Premium Website

A premium, Apple-style website for **Allied MFG Pte Ltd**, a Singapore precision engineering and manufacturing company.

Built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Framer Motion.

---

## Quick Start

```bash
cd allied-mfg
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Asset Setup

### Logo

The site uses an SVG logo component by default. To use your own PNG logo:

1. Place your logo file at:
   ```
   public/logo.png
   ```
2. Update `components/Logo.tsx` to use `<Image src="/logo.png" ... />` instead of the inline SVG.

### Hero Video

The 8-second CNC machining video is already placed at:
```
public/videos/hero-machining.mp4
```

If you need to replace it, put your new video at the same path.

---

## Project Structure

```
allied-mfg/
├── app/
│   ├── layout.tsx              # Root layout with Header + Footer
│   ├── page.tsx                # Homepage
│   ├── company/page.tsx
│   ├── industries/page.tsx
│   ├── services/page.tsx
│   ├── machinery/page.tsx
│   ├── quality/page.tsx
│   ├── contact/page.tsx
│   └── request-quote/page.tsx
├── components/
│   ├── Header.tsx              # Sticky nav with mobile menu
│   ├── Footer.tsx
│   ├── Logo.tsx                # SVG logo component
│   ├── Hero.tsx                # Video hero section
│   ├── ScrollProcess.tsx       # Scroll-driven process storytelling
│   ├── SectionHeading.tsx
│   ├── CapabilityCard.tsx
│   ├── IndustryCard.tsx
│   ├── CTASection.tsx
│   └── QuoteForm.tsx
├── public/
│   ├── logo.png                # Place your logo here
│   └── videos/
│       └── hero-machining.mp4  # Hero background video
└── README.md
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with video hero, scroll process, capabilities, industries, machinery preview |
| `/company` | About, values, Singapore presence |
| `/industries` | Semiconductor, Automation, Power & Energy, Precision Engineering |
| `/services` | All services with specs |
| `/machinery` | Equipment, capabilities, materials |
| `/quality` | QA process, inspection steps, tolerances |
| `/contact` | Contact info and enquiry form |
| `/request-quote` | Full quote request form |

---

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript**
- **Tailwind CSS** — Custom design system
- **Framer Motion** — Entrance animations, scroll-driven process section
- **Inter** — Typography (Google Fonts)

---

## Build for Production

```bash
npm run build
npm start
```

---

## Deploy

Deploy to [Vercel](https://vercel.com) in one click — just connect the GitHub repo and deploy the `allied-mfg` subdirectory as the root.

Or use any Node.js hosting platform with `npm run build && npm start`.
