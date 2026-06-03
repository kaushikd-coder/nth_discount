# UniBlox Frontend

Hey there! 👋 Welcome to the frontend of our e-commerce project. I built this using Next.js and TypeScript to create a smooth, user-friendly shopping experience.

## Project Overview

Here's how everything is organized:

```text
app/
├── components/          # Reusable UI components
│   ├── Loader.tsx      # Loading animations
│   ├── Navbar.tsx      # Site navigation
│   └── ProductCard.tsx # Product display
│
├── lib/                # Core utilities
│   ├── api.ts         # Backend communication
│   └── types.ts       # TypeScript definitions
│
└── pages/             # Main app pages
    ├── admin/         # Admin dashboard
    ├── cart/          # Shopping cart
    └── discounts/     # Discount management
```

## What Makes This Special?

### Modern Shopping Experience 🛍️

- Clean, intuitive interface
- Responsive design that works on all devices
- Real-time price and cart updates

### Smart Admin Tools 🔧

- Easy product management
- Discount code generation
- Order tracking and processing

### Seamless Integration 🔄

- Works perfectly with our backend
- Fast API communication
- Consistent data handling

## Core Features

### Shopping Interface

- Product browsing with dynamic filtering
- Real-time cart updates
- Smooth checkout process

### Admin Dashboard

- Product management
- Order processing
- Discount code generation

## Try It Out

Getting started is easy:

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see it in action!

## Tech Choices

I picked these technologies because:

- **Next.js**: Perfect for fast, SEO-friendly e-commerce
- **TypeScript**: Keeps our code reliable
- **App Router**: Latest Next.js features for better performance
- **CSS Modules**: Clean, scoped styling

## Key Components

- `ProductCard`: Smart product display with dynamic pricing
- `Navbar`: Responsive navigation with cart status
- `Loader`: Smooth loading states for better UX
