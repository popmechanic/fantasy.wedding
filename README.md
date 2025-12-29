# Fantasy Wedding

**A beautiful, private photo gallery for your special day.**

Fantasy Wedding is a multi-tenant SaaS platform where couples create their own custom subdomain to collect and share wedding photos with guests. No app downloads required—guests simply visit your personalized gallery, upload their photos, and relive the magic together in real-time.

[Live Demo](https://fantasy.wedding) | [Get Started](https://fantasy.wedding)

---

## Why Fantasy Wedding?

Every guest at your wedding captures unique moments. Fantasy Wedding brings all those memories together in one elegant, private gallery that syncs instantly across all devices.

- **Your own subdomain** — `yournames.fantasy.wedding`
- **Zero friction for guests** — No accounts needed to upload photos
- **Real-time sync** — Photos appear instantly for everyone
- **Beautiful presentation** — Masonry gallery with lightbox viewing
- **Private by default** — Only people with your link can see your photos

---

## Features

### For Couples
- Custom subdomain for your wedding (`alice-and-bob.fantasy.wedding`)
- Private, invite-only photo gallery
- Real-time photo uploads from all your guests
- Beautiful masonry grid layout with full-screen lightbox
- Captions and contributor names on every photo
- Works on any device—phones, tablets, laptops

### For Guests
- Upload photos without creating an account
- Add captions to remember the moment
- Browse all shared photos in one place
- No app to download—just visit the link

### For Admins
- Tenant management dashboard
- Subscription tracking and MRR analytics
- User registration monitoring

---

## Tech Stack

Fantasy Wedding is built with modern, edge-first architecture:

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Tailwind CSS 4 |
| **Database** | Fireproof (local-first, real-time sync) |
| **Auth & Billing** | Clerk (authentication, subscriptions via Stripe) |
| **Hosting** | Cloudflare Pages + Workers |
| **Storage** | Cloudflare KV (tenant metadata) |

### Architecture Highlights

- **Multi-tenant isolation** — Each subdomain gets its own Fireproof database
- **Local-first** — Photos sync in real-time, work offline
- **Edge-deployed** — Sub-50ms response times globally
- **No build step** — Pure ESM imports via CDN

---

## Getting Started

### Prerequisites

- [Cloudflare account](https://cloudflare.com) (Pages + Workers)
- [Clerk account](https://clerk.com) with Billing enabled
- Custom domain with wildcard DNS support

### 1. Clone & Configure

```bash
git clone https://github.com/yourusername/fantasy.wedding.git
cd fantasy.wedding
```

### 2. Set Up Clerk

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Enable **Clerk Billing** and connect Stripe
3. Create pricing plans:
   - `monthly` — $9/month
   - `yearly` — $79/year
4. Add your domain: `fantasy.wedding` and `*.fantasy.wedding`
5. Copy your publishable key to `index.html`

### 3. Set Up Cloudflare

1. Create a new **Pages** project
2. Upload `index.html`, `app.jsx`, and `worker.js`
3. Add custom domain with wildcard subdomain support
4. Create a **KV namespace** for tenant data
5. Deploy the **Worker** for API routing

### 4. Configure DNS

| Type | Name | Value |
|------|------|-------|
| A | @ | Cloudflare Pages IP |
| A | * | Cloudflare Pages IP |
| CNAME | www | fantasy.wedding |

The wildcard `*` record enables unlimited custom subdomains.

### 5. Set Admin Access

Find your Clerk User ID and add it to the `ADMIN_USER_IDS` array in the admin section of `index.html`.

---

## Project Structure

```
fantasy.wedding/
├── index.html      # Main app (landing, tenant gallery, admin)
├── app.jsx         # Photo gallery React component
├── worker.js       # Cloudflare Worker (routing, API, webhooks)
├── wrangler.toml   # Worker configuration
└── SETUP.md        # Detailed deployment guide
```

---

## Pricing

Fantasy Wedding uses a simple subscription model:

| Plan | Price | Includes |
|------|-------|----------|
| **Monthly** | $9/month | Unlimited photos, custom subdomain, guest sharing |
| **Yearly** | $79/year | Same features, 2 months free |

---

## How It Works

1. **Couple signs up** at `fantasy.wedding` and chooses a subdomain
2. **Payment** is processed through Clerk Billing (Stripe)
3. **Custom gallery** is instantly available at `theirname.fantasy.wedding`
4. **Guests visit** the link and upload photos—no account required
5. **Photos sync** in real-time across all connected devices
6. **Memories preserved** in a beautiful, private gallery forever

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Clerk not loading | Verify publishable key and allowed domains |
| Subscription check failing | Ensure plan slugs match: `monthly`, `yearly`, `pro`, `basic`, `starter` |
| Admin access denied | Add your Clerk User ID to `ADMIN_USER_IDS` |
| Photos not isolated | Each subdomain auto-creates database `fantasy-wedding-{subdomain}` |

---

## Built With

- [Fireproof](https://fireproof.storage) — Local-first database
- [Clerk](https://clerk.com) — Authentication and billing
- [Cloudflare](https://cloudflare.com) — Edge hosting and workers
- [Vibes.diy](https://vibes.diy) — Rapid SaaS generation

---

## License

MIT

---

*Made with love for couples who want to remember every moment.*
