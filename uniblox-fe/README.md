# UniBlox Frontend

Frontend for the UniBlox discount-code ecommerce demo. It is built with Next.js App Router, TypeScript, React, and Tailwind CSS.

## Current Folder Structure

```text
uniblox-fe/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard: stats and issued coupons
│   ├── cart/
│   │   └── page.tsx              # Cart, coupon entry, checkout flow
│   ├── components/
│   │   ├── Loader.tsx            # Skeleton loading states
│   │   ├── Navbar.tsx            # Site navigation and cart quantity badge
│   │   └── ProductCard.tsx       # Product card and add-to-cart action
│   ├── discounts/
│   │   └── generate/
│   │       └── page.tsx          # Admin coupon generation page
│   ├── lib/
│   │   ├── api.ts                # Backend API client functions
│   │   ├── cartEvents.ts         # Shared cart badge update events
│   │   ├── navigationState.ts    # Refresh-only skeleton loading helper
│   │   └── types.ts              # Shared TypeScript types
│   ├── globals.css               # Tailwind import and global theme styles
│   ├── layout.tsx                # Root layout and fonts
│   └── page.tsx                  # Home page and product listing
├── public/                       # Static assets
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Scripts and dependencies
├── postcss.config.mjs            # Tailwind/PostCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Features

- Product listing with add-to-cart actions.
- Navbar cart badge that updates after cart changes.
- Cart page with coupon input, checkout, and available coupon chips.
- Admin dashboard for order count, revenue, discount totals, and coupon history.
- Admin coupon generation with configurable percentage from `1` to `50`.
- Copyable unused coupon codes with hover feedback.
- Skeleton loaders on browser refresh/direct load, while client-side route changes stay fast.

## Discount Flow

- The backend determines when the next checkout is an nth order.
- Admin can generate one coupon for that upcoming nth checkout.
- Unused coupons are shown in the cart only while they are valid for the current checkout.
- Clicking a coupon chip copies it and fills the discount input.
- Checkout validates the entered coupon before applying the discount.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend expects the backend API at:

```text
http://localhost:5000/api
```

## Scripts

```bash
npm run dev      # Start Next.js development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
