import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useThemeStore from './store/themeStore';
import AdminLogin      from './pages/AdminLogin';
import AdminDashboard  from './pages/AdminDashboard';
import OrdersPage      from './pages/OrdersPage';
import ProductsPage    from './pages/ProductsPage';
import ReviewsPage     from './pages/ReviewsPage';
import BlogPage        from './pages/BlogPage';
import AdminLayout     from './components/AdminLayout';
import ProtectedRoute  from './components/ProtectedRoute';

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme)

  useEffect(() => {
    initTheme()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<AdminLogin />} />
        <Route path="/"         element={<Protected><AdminDashboard /></Protected>} />
        <Route path="/orders"   element={<Protected><OrdersPage /></Protected>} />
        <Route path="/products" element={<Protected><ProductsPage /></Protected>} />
        <Route path="/reviews"  element={<Protected><ReviewsPage /></Protected>} />
        <Route path="/blog"     element={<Protected><BlogPage /></Protected>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
