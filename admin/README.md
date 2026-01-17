# Admin Portal

Admin interface for managing the ecommerce store inventory.

## Features

- **Admin Authentication**: Secure login restricted to admin users only
- **Inventory Management**: Full CRUD operations for products
- **Dashboard**: View product statistics and low stock alerts
- **Modern UI**: Clean, responsive design with modern styling

## Setup

1. Install dependencies:
```bash
bun install
```

2. Configure environment:
```bash
cp .env.example .env
# Update VITE_API_URL if backend is on different host/port
```

3. Start development server:
```bash
bun dev
```

The admin portal will run on http://localhost:5174

## Admin Access

To access the admin portal, you need an account with `role: 'admin'` in the database.

### Create an Admin User

You can create an admin user by:

1. Registering a normal user through the customer frontend or API
2. Updating the user's role in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use the backend API directly with the MongoDB shell:

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use your_database_name

# Update user role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Features Overview

### Dashboard
- View total products
- Track low stock items (< 10 units)
- Quick access to add new products

### Product Management
- Create new products with images, pricing, sizes, colors
- Update existing product details and inventory
- Delete products
- Real-time stock tracking

### Security
- JWT-based authentication
- Admin-only route protection
- Separate from customer frontend

## Tech Stack

- **Frontend**: React 19, Vite, Zustand, React Router
- **Backend**: Node.js, Express, MongoDB (shared with customer app)
- **Styling**: Custom CSS with modern design system
