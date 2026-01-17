# Fashion Ecommerce Frontend

A modern React + Vite frontend for a fashion ecommerce store featuring tops, bottoms, and accessories.

## Features

- Modern React with Vite
- Responsive design with CSS
- Product listing and filtering
- Product details page
- Shopping cart management
- User authentication (Login/Register)
- Order management
- Zustand for state management
- Axios for API calls

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── api/            # API services
├── context/        # Zustand stores
├── styles/         # CSS stylesheets
├── assets/         # Images and static files
└── App.jsx         # Main app component
```

## Installation

1. Navigate to the frontend folder:
```bash
cd ecommerce/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Development Server

```bash
npm run dev
```

The application will run at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Pages

- **Home** - Landing page with featured products
- **Products** - Product listing with search and filters
- **Product Detail** - Detailed product view with images and options
- **Cart** - Shopping cart with checkout
- **Login** - User login page
- **Register** - User registration page
- **Orders** - User order history

## Components

- **Header** - Navigation header
- **Footer** - Footer component
- **ProductCard** - Product display card

## State Management

Using Zustand for global state:
- `authStore` - User authentication state
- `cartStore` - Shopping cart state

## API Integration

Axios instance configured with:
- Automatic token attachment to requests
- Base URL from environment variables
- Auto-logout on 401 responses

## Environment Variables

- `VITE_API_URL` - Backend API base URL

## Technologies Used

- React 18 - UI library
- Vite - Build tool
- React Router - Client-side routing
- Axios - HTTP client
- Zustand - State management
- CSS 3 - Styling

## Development

All styles are in individual CSS files per page/component for better organization and maintainability.
