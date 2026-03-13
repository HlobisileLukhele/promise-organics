# Promise Organics — E-Commerce Platform

Full-stack e-commerce platform for Promise Organics, a natural hair and skincare brand.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Zustand |
| Admin | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express v5, Supabase (PostgreSQL) |
| Auth | JWT + bcryptjs |
| Payments | PayFast |
| Container | Docker, nginx |

---

## Project Structure

```
promise-organics-ecommerce/
├── frontend/          # Customer-facing React SPA
├── admin/             # Admin dashboard React SPA
├── backend/           # Express REST API
├── docker-compose.yml
└── Makefile
```

---

## Quick Start

### With Docker (recommended)

```bash
# Copy and fill in backend env
cp backend/.env.example backend/.env

# Build and start all services
make build
make up

# Tail logs
make logs
```

Services:
- Frontend → http://localhost:80
- Admin panel → http://localhost:3001
- Backend API → http://localhost:5000

### Local Development

```bash
# Install all dependencies
make install

# Start backend (in one terminal)
make dev-backend

# Start frontend (in another terminal)
make dev-frontend

# Start admin (in another terminal)
make dev-admin
```

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
EMAIL_USER=you@gmail.com
EMAIL_PASS=your-app-password
CONTACT_RECEIVER_EMAIL=sales@promiseorganics.co.za
CLIENT_URL=http://localhost:5173
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true
```

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

---

## Testing

### Backend (Jest + Supertest)

```bash
cd backend
npm test              # run all tests
npm run test:verbose  # with full output
npm run test:coverage # with coverage report
```

### Frontend (Vitest + Testing Library)

```bash
cd frontend
npm run test:run      # run all tests once
npm run test          # watch mode
npm run test:coverage # with coverage report
```

### Run all tests

```bash
make test-all
```

---

## API Reference

All protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Server health check |
| GET | `/api/health` | — | DB health check |
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/products` | — | All products |
| GET | `/api/products/:id` | — | Single product |
| GET | `/api/cart` | ✓ | Get cart |
| POST | `/api/cart` | ✓ | Add to cart |
| PATCH | `/api/cart/:id` | ✓ | Update quantity |
| DELETE | `/api/cart/:id` | ✓ | Remove item |
| GET | `/api/wishlist` | ✓ | Get wishlist |
| POST | `/api/wishlist` | ✓ | Add to wishlist |
| DELETE | `/api/wishlist/:id` | ✓ | Remove item |
| GET | `/api/orders` | ✓ | User orders |
| POST | `/api/orders` | ✓ | Create order from cart |
| GET | `/api/orders/:id` | ✓ | Order details |
| GET | `/api/reviews` | — | Approved reviews |
| POST | `/api/reviews` | — | Submit review |
| POST | `/api/contact` | — | Send enquiry |

---

## Docker Commands

```bash
make up        # start services (detached)
make down      # stop services
make build     # rebuild images
make restart   # rebuild + restart
make logs      # tail all logs
make ps        # show running containers
make clean     # stop + remove volumes + images
```
