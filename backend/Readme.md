# UniBlox E-Commerce Backend

Express and TypeScript backend for the UniBlox ecommerce discount-code demo. It provides product, cart, checkout, and admin coupon APIs.

## Current Folder Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── admin.controller.ts     # Admin stats and coupon generation
│   │   ├── cart.controller.ts      # Add-to-cart and cart retrieval
│   │   ├── checkout.controller.ts  # Checkout and coupon validation
│   │   └── product.controller.ts   # Product listing
│   ├── routes/
│   │   ├── admin.routes.ts         # /api/admin endpoints
│   │   ├── cart.routes.ts          # /api/cart endpoints
│   │   ├── checkout.routes.ts      # /api/checkout endpoint
│   │   ├── index.ts                # Main API route aggregator
│   │   └── product.routes.ts       # /api/products endpoint
│   ├── stores/
│   │   └── db.ts                   # In-memory products, carts, orders, stats, coupons
│   ├── app.ts                      # Express app setup, middleware, routes
│   └── server.ts                   # Server startup on PORT or 5000
├── dist/                           # Compiled JavaScript output from npm run build
├── package.json                    # Scripts and dependencies
├── package-lock.json               # Locked dependency versions
└── tsconfig.json                   # TypeScript compiler options
```

## API Overview

Base URL:

```text
http://localhost:5000/api
```

### Products

```text
GET /api/products
```

Returns the available products.

### Cart

```text
GET /api/cart?userId=guest-001
POST /api/cart/add
```

`POST /api/cart/add` body:

```json
{
  "userId": "guest-001",
  "productId": "p1",
  "qty": 1
}
```

### Checkout

```text
POST /api/checkout
```

Body without coupon:

```json
{
  "userId": "guest-001"
}
```

Body with coupon:

```json
{
  "userId": "guest-001",
  "discountCode": "SAVE25-ABC123"
}
```

Checkout validates the coupon before applying the discount. Used, invalid, expired, or wrong-checkout coupons are rejected.

### Admin

```text
GET /api/admin/stats
POST /api/admin/discounts/generate
```

`POST /api/admin/discounts/generate` body:

```json
{
  "percentage": 25
}
```

The percentage must be a whole number from `1` to `50`.

## Discount Rules

- `NTH_ORDER` is currently `3`.
- Admin can generate one coupon for an upcoming nth checkout, such as order `3`, `6`, `9`, and so on.
- Only one active unused coupon can exist for the current upcoming checkout.
- Coupons are tied to the exact checkout number they were generated for.
- If the intended nth checkout happens without using the coupon, that coupon becomes expired for later checkouts.
- Checkout applies a discount only when the user submits a valid coupon code.

## In-Memory Storage

This backend uses in-memory data structures in `src/stores/db.ts`:

```ts
carts
orders
discountCodes
orderCount
itemsPurchasedCount
totalPurchaseAmount
totalDiscountAmount
```

There is no database or browser local storage for backend data. Stopping the Node backend process resets all in-memory data.

## Getting Started

Install dependencies:

```bash
npm install
```

Start in development mode:

```bash
npm run dev
```

Build TypeScript:

```bash
npm run build
```

Start compiled output:

```bash
npm start
```

The server runs at [http://localhost:5000](http://localhost:5000).

## Scripts

```bash
npm run dev      # Start ts-node-dev watcher
npm run build    # Compile TypeScript to dist/
npm start        # Run dist/server.js
npm test         # Run Jest tests
```

## Tech Stack

- Node.js
- Express
- TypeScript
- CORS
- dotenv
- Jest configured for tests
