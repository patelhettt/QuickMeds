# QuickMeds Backend

This is the backend server for the QuickMeds application, a comprehensive pharmacy and inventory management system.

## Overview

The QuickMeds backend provides a RESTful API that supports all the functionality needed for pharmacy management, including:

- User authentication and authorization
- Product inventory management (pharmacy and non-pharmacy items)
- Order processing and tracking
- Purchase management
- Returns handling
- Supplier management
- Employee management
- Customer records

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication

## API Endpoints

The API is organized into several categories:

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration

### Products
- `GET /api/products/pharmacy`: Get all pharmacy products
- `GET /api/products/nonPharmacy`: Get all non-pharmacy products
- `POST /api/products`: Add a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

### Orders
- `GET /api/orders/pharmacy`: Get all pharmacy orders
- `GET /api/orders/nonPharmacy`: Get all non-pharmacy orders
- `POST /api/orders`: Create a new order
- `PUT /api/orders/:id`: Update an order
- `DELETE /api/orders/:id`: Delete an order

### Purchases
- `GET /api/purchases/pharmacy`: Get all pharmacy purchases
- `GET /api/purchases/nonPharmacy`: Get all non-pharmacy purchases
- `POST /api/purchases`: Create a new purchase
- `PUT /api/purchases/:id`: Update a purchase
- `DELETE /api/purchases/:id`: Delete a purchase

### Returns
- `GET /api/returns/customers`: Get all customer returns
- `GET /api/returns/expiresOrDamagesReturns`: Get all expired or damaged returns
- `POST /api/returns`: Create a new return
- `PUT /api/returns/:id`: Update a return
- `DELETE /api/returns/:id`: Delete a return

### Setup
- `GET /api/setup/categories`: Get all categories
- `GET /api/setup/unitTypes`: Get all unit types
- `GET /api/setup/companies`: Get all companies

### Users
- `GET /api/products/employees`: Get all employees
- `GET /api/products/customers`: Get all customers
- `POST /api/users`: Create a new user
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user

### Suppliers
- `GET /api/suppliers/lists`: Get all suppliers
- `GET /api/suppliers/payments`: Get all supplier payments
- `GET /api/suppliers/documents`: Get all supplier documents
- `POST /api/suppliers`: Add a new supplier
- `PUT /api/suppliers/:id`: Update a supplier
- `DELETE /api/suppliers/:id`: Delete a supplier

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-repo/quickmeds-backend.git
   cd quickmeds-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quickmeds
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server
   ```
   npm start
   ```

## Development

For development with auto-restart:
