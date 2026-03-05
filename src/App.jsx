import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      {/* ThemeProvider applies dark/light class to <html> */}
      <ThemeProvider>
        {/* AuthProvider manages user session and auth state */}
        <AuthProvider>
          {/* CartProvider manages shopping cart per user */}
          <CartProvider>
            {/* ToastProvider renders global toast notifications */}
            <ToastProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes — require authenticated user */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/products" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Catch all — redirect unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
