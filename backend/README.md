# Fashion Ecommerce Backend

Express.js REST API for a fashion ecommerce store with support for products, authentication, cart, and orders.

## Features

- User authentication with JWT
- Product management (CRUD)
- Shopping cart functionality
- Order management
- MongoDB database with Mongoose
- Express.js REST API
- Error handling and validation

## Project Structure

```
src/
├── config/         # Database configuration
├── models/         # Mongoose schemas
├── controllers/    # Route controllers
├── routes/         # API routes
├── middleware/     # Custom middleware
└── utils/          # Utility functions
```

## Installation

1. Navigate to the backend folder:
```bash
cd ecommerce/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/fashion_ecommerce
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item (protected)
- `DELETE /api/cart/:itemId` - Remove from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `DELETE /api/orders/:id/cancel` - Cancel order (protected)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRY` - Token expiry time (default: 30d)
- `NODE_ENV` - Environment (development/production)

## Database Models

### User
- name, email, password, phone
- address (street, city, state, zipCode, country)
- role (user/admin)

### Product
- name, description, category (tops/bottoms/accessories)
- price, discountPrice, stock
- images, sizes, colors
- rating, reviews

### Cart
- user (reference to User)
- items (product, quantity, size, color, price)
- totalPrice

### Order
- user (reference to User)
- items (product details, quantity, price)
- shippingAddress
- totalPrice, shippingCost, tax
- status, paymentMethod, paymentStatus

## Technologies Used

- Express.js - Web framework
- Mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- express-validator - Request validation
- CORS - Cross-origin resource sharing
- dotenv - Environment variables
