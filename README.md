# BudgetWise - Personal Finance Management Application

BudgetWise is a comprehensive personal finance management application that helps users track their expenses, manage budgets, and set savings goals. Built with modern web technologies, it provides a seamless and intuitive user experience for managing your financial life.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Router:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Heroicons
- **Authentication:** JWT with secure storage

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT)
- **API:** RESTful architecture
- **Middleware:** Custom auth middleware
- **Validation:** Express-validator

### Database
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Models:**
  - User
  - Budget
  - Expense
  - Savings

## 🌟 Features

- **User Authentication**
  - Register/Login with email
  - JWT-based authentication
  - Secure password handling

- **Budget Management**
  - Create and manage monthly budgets
  - Track expenses against budgets
  - Visual budget analytics

- **Expense Tracking**
  - Add, edit, and delete expenses
  - Categorize expenses
  - View expense history

- **Savings Goals**
  - Set financial goals
  - Track progress
  - Goal completion notifications

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Frontend Setup
```bash
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

# Clone the repository
git clone https://github.com/suryacharan5555/budget-tracker.git

# Navigate to project directory
cd budget-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start server
npm run dev
```

## 🌍 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=your_backend_url
```

### Backend (.env)
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=8000
```

### Vercel (production)
Set the following Environment Variables in your Vercel project (Project Settings -> Environment Variables):

```text
MONGODB_URI  # MongoDB connection string (MongoDB Atlas)
JWT_SECRET   # Secret used to sign JWT tokens
VITE_API_URL # Optional: set to the full backend URL if you use an external API (otherwise leave blank to use /api)
```

Notes:
- Vercel will deploy frontend as a static site and handle serverless functions placed under the `api/` folder. The `api/[...path].js` file wraps your existing Express routes for serverless.
- Ensure your MongoDB Atlas cluster allows connections from Vercel (add Vercel IPs or allow access from anywhere 0.0.0.0/0 temporarily while testing).
- On Vercel, the backend will be available at `/api/*` (for example `/api/auth/login`). If you prefer a separate backend host, set `VITE_API_URL` to that host.

## 📦 Deployment

### Frontend Deployment (Vercel)
The frontend is deployed on Vercel with the following configuration:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** Set in Vercel dashboard
- **Framework Preset:** Vite
- **Production URL:** [https://budget-tracker-blue.vercel.app](https://budget-tracker-blue.vercel.app)

### Deploying to Vercel (recommended)

1. Install the Vercel CLI (optional):
```bash
npm i -g vercel
```
2. From the project root run:
```bash
vercel login
vercel
```
3. During `vercel` setup choose the project root and ensure build command is `npm run build` and output directory is `dist`.
4. In Vercel dashboard add the environment variables listed above.
5. Trigger a deployment.

If you encounter issues after deploy, check Vercel function logs (Vercel Dashboard -> Functions) and confirm `MONGODB_URI` and `JWT_SECRET` are set.

### Backend Deployment (Render)
The backend is hosted on Render with the following setup:
- **Type:** Web Service
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- **Environment Variables:** Configured in Render dashboard
- **Production URL:** [https://budget-tracker-server-0wr0.onrender.com](https://budget-tracker-server-0wr0.onrender.com)

### Database (MongoDB Atlas)
Database is hosted on MongoDB Atlas:
- Dedicated cluster
- Automatic backups
- Network security with IP whitelisting
- Connection via MongoDB URI

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user profile

### Budget Endpoints
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - Get user's budgets
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Expense Endpoints
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get user's expenses
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Savings Endpoints
- `POST /api/savings` - Create savings goal
- `GET /api/savings` - Get savings goals
- `PUT /api/savings/:id` - Update goal
- `DELETE /api/savings/:id` - Delete goal

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- HTTP-only cookies
- CORS protection
- Rate limiting
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
