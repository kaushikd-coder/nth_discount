# UniBlox E-Commerce Backend

Hey there! 👋 I built this e-commerce backend with Express and TypeScript. It's designed to be both powerful and easy to understand, handling everything from shopping carts to automatic discounts.

## Project Overview

Here's how I organized everything:

```text
backend/
├── src/
│   ├── controllers/      # Brain of the application
│   │   ├── cart.controller.ts      # Shopping cart logic
│   │   ├── checkout.controller.ts  # Payment and discounts
│   │   └── product.controller.ts   # Product management
│   │
│   ├── routes/          # API endpoints
│   │   ├── cart.routes.ts
│   │   ├── checkout.routes.ts
│   │   ├── product.routes.ts
│   │   └── index.ts     # Routes hub
│   │
│   ├── stores/
│   │   └── db.ts       # Data management
│   │
│   ├── app.ts         # Express setup
│   └── server.ts      # Server startup
```

## What Makes This Special?

### Smart Shopping Cart 🛒

- Remembers everything you add
- Keeps track of prices when items are added
- No surprise price changes at checkout

### Automatic Discounts 🎁

- Every Nth order gets a 10% discount (you can configure how often)
- System generates unique discount codes
- Tracks usage to prevent double-dipping

### Smooth Checkout Process 💳

- Automatically calculates totals
- Handles multiple types of discounts
- Keeps a clean order history

## Key Features In Detail

### Shopping Cart Logic

- `addToCart`: Smart product tracking with price snapshots
- `getResCart`: Quick cart creation and retrieval

### Checkout System

- `checkout`: Complete order processing
- `generateDiscount`: Creates and manages discount codes

### Behind The Scenes

- `updateStats`: Smart analytics tracking
- `round2`: Precise price calculations

## Want To Try It?

Getting started is super easy:

1. Install dependencies:

```bash
npm install
```

2. Start it up:

```bash
npm start
```

You'll find your server running at [http://localhost:5000](http://localhost:5000)

## Why I Built It This Way

I picked these tools for good reasons:

- **TypeScript**: Catches bugs before they happen
- **Express**: Fast and easy to work with
- **Simple Storage**: Perfect for development
- **Clean Structure**: Easy to maintain and expand
