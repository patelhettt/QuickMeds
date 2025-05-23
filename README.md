# QuickMeds

QuickMeds is a comprehensive pharmacy and inventory management system designed to streamline operations for pharmacies and medical supply stores.

## Project Overview

QuickMeds provides a complete solution for managing:
- Pharmacy and non-pharmacy inventory
- Customer orders and sales
- Supplier relationships and purchases
- Returns processing
- Employee management
- Reporting and analytics

## Features

- **Dual Inventory Management**: Separate tracking for pharmacy and non-pharmacy products
- **Order Processing**: Complete order lifecycle management
- **Purchase Management**: Track all purchases from suppliers
- **Returns Handling**: Process customer returns and expired/damaged items
- **User Management**: Role-based access control for employees
- **Customer Records**: Maintain detailed customer information
- **Supplier Management**: Track supplier information, payments, and documents
- **Dashboard**: Real-time overview of business operations
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

The project is organized into two main directories:

```
quickmeds/
├── frontend/           # React frontend application
└── backend/            # Node.js backend API
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/quickmeds.git
   cd quickmeds
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/quickmeds
     JWT_SECRET=your_jwt_secret
     ```

5. Start the development servers
   - Backend:
     ```
     cd backend
     npm run dev
     ```
   - Frontend:
     ```
     cd frontend
     npm start
     ```

6. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Deployment

### Backend
The backend can be deployed to any Node.js hosting service like Heroku, Vercel, or AWS.

### Frontend
The React frontend can be deployed to services like Netlify, Vercel, or GitHub Pages.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact the development team at support@quickmeds.com.
