# Fantasy Wedding SaaS - Deployment Guide

## Generated Files

| File | Purpose | Deploy To |
|------|---------|-----------|
| `index-landing.html` | Marketing page with pricing | `fantasy.wedding` (root) |
| `app.html` | Tenant app with auth | `*.fantasy.wedding` (subdomains) |
| `admin.html` | Admin dashboard | `admin.fantasy.wedding` |

## 1. Clerk Setup

1. Go to [clerk.com](https://clerk.com) and sign in
2. Your publishable key is already configured: `pk_test_anVzdC1rYW5nYXJvby00OC5jbGVyay5hY2NvdW50cy5kZXYk`
3. **Enable Clerk Billing**:
   - Go to **Configure** → **Billing**
   - Connect your Stripe account
   - Create a product with these plans:
     - `monthly` - $5/month
     - `yearly` - $49/year

4. **Add your domain**:
   - Go to **Configure** → **Domains**
   - Add `fantasy.wedding` and `*.fantasy.wedding`

5. **Get your admin user ID**:
   - Go to **Users** in Clerk Dashboard
   - Find your user and copy the User ID (starts with `user_`)
   - Update `admin.html` - replace `[]` in `ADMIN_USER_IDS` with `["user_xxx"]`

## 2. DNS Setup

Add these DNS records to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | [Your host IP] |
| A | * | [Your host IP] |
| CNAME | www | fantasy.wedding |

**Note**: The wildcard `*` record is what enables `alice.fantasy.wedding`, `bob.fantasy.wedding`, etc.

## 3. Deploy to Static Host

### Cloudflare Pages (Recommended)

1. Create new Pages project
2. Upload files:
   - Rename `index-landing.html` → `index.html`
   - Upload `app.html` and `admin.html`
3. Add custom domain: `fantasy.wedding`
4. Enable wildcard subdomains in domain settings

### File Routing

Most static hosts serve based on subdomain detection. You may need:

**`_redirects` file (Netlify):**
```
# Handled by client-side subdomain detection
/* /index.html 200
```

**For subdomains**: The same files are served to all subdomains. The JavaScript detects the subdomain and:
- Shows landing page on root domain
- Shows tenant app on subdomains
- Shows admin on `admin.` subdomain

## 4. Test Your Setup

1. **Landing page**: Visit `fantasy.wedding`
   - Should show pricing and signup

2. **Sign up flow**:
   - Click "Get Started"
   - Create account with Clerk
   - Choose a subdomain (e.g., `alice`)
   - Complete payment

3. **Tenant app**: Visit `alice.fantasy.wedding`
   - Should prompt for sign-in
   - After sign-in, shows photo sharing app

4. **Admin**: Visit `admin.fantasy.wedding`
   - Sign in with your admin account
   - Should show tenant list

## Pricing Configuration

Current pricing:
- **Monthly**: $5/month
- **Yearly**: $49/year (2 months free!)

Features advertised:
- Unlimited photo uploads
- Private photo gallery
- Custom subdomain
- Share with all your guests

## Troubleshooting

### "Clerk not loading"
- Verify publishable key is correct
- Check that domain is added to Clerk's allowed origins

### "Subscription check failing"
- Ensure Clerk Billing plans match: `monthly`, `yearly`, `pro`, `basic`, or `starter`
- Check Stripe connection in Clerk dashboard

### "Admin access denied"
- Copy your Clerk user ID from the dashboard
- Update `ADMIN_USER_IDS` array in `admin.html`

### "Photos not isolated between tenants"
- The app uses dynamic database naming: `fantasy-wedding-{subdomain}`
- Each subdomain gets its own Fireproof database automatically
