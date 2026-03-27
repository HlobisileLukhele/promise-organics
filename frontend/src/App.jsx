import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ChatWidget from '@/components/common/ChatWidget';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import useThemeStore from '@/store/themeStore';
import { useCsrfStore } from '@/store/csrfStore';
import Home from '@/Pages/Home';
import About from '@/Pages/About';
import Blog from '@/Pages/Blog';
import BlogPost from '@/Pages/BlogPost';
import Contact from '@/Pages/Contact';
import Shop from '@/Pages/Shop';
import SignUp from '@/Pages/auth/SignUp';
import SignIn from '@/Pages/auth/SignIn';
import ForgotPassword from '@/Pages/auth/ForgotPassword';
import Wishlist from '@/Pages/Wishlist';
import Cart from '@/Pages/Cart';
import Checkout from '@/Pages/Checkout';
import PaymentSuccess from '@/Pages/PaymentSuccess';
import PaymentCancelled from '@/Pages/PaymentCancelled';
import UserNavbar from '@/components/layout/UserNavbar';
import Dashboard from '@/Pages/user/Dashboard';
import AccountDetails from '@/Pages/user/AccountDetails';
import Orders from '@/Pages/user/Orders';
import OrderDetails from '@/Pages/user/OrderDetails';
import Address from '@/Pages/user/Address';
import EditAddress from '@/Pages/user/EditAddress';
import TermsAndConditions from '@/Pages/TermsAndConditions';
import PrivacyPolicy from '@/Pages/PrivacyPolicy';

export default function App() {
  const token          = useUserStore((s) => s.token)
  const loadCart       = useCartStore((s) => s.loadCart)
  const initTheme      = useThemeStore((s) => s.initTheme)
  const fetchCsrfToken = useCsrfStore((s) => s.fetchToken)

  useEffect(() => {
    initTheme()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch CSRF token once on app init. The backend sets an httpOnly cookie
  // and returns a masked token we'll attach to every mutating request.
  // After login the token is automatically rotated — see userStore.login().
  useEffect(() => {
    fetchCsrfToken()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) loadCart()
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="shop" element={<Shop />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/cancelled" element={<PaymentCancelled />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />

          {/* authenticated user navigation */}
          <Route path="account" element={<UserNavbar/>}>
            <Route index element={<Dashboard />} />
            <Route path="details" element={<AccountDetails />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="address" element={<Address />} />
            <Route path="address/edit" element={<EditAddress />} />
          </Route>

        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}