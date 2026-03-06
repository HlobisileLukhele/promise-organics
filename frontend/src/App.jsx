import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ChatWidget from '@/components/common/ChatWidget';
import Home from '@/Pages/Home';
import About from '@/Pages/About';
import Contact from '@/Pages/Contact';
import Shop from '@/Pages/Shop';
import SignUp from '@/Pages/auth/SignUp';
import SignIn from '@/Pages/auth/SignIn';
import ForgotPassword from '@/Pages/auth/ForgotPassword';
import Wishlist from '@/Pages/Wishlist';
import Cart from '@/Pages/Cart';
import Checkout from '@/Pages/Checkout';
import UserNavbar from '@/components/layout/UserNavbar';
import Dashboard from '@/Pages/user/Dashboard';
import AccountDetails from '@/Pages/user/AccountDetails';
import Orders from '@/Pages/user/Orders';
import OrderDetails from '@/Pages/user/OrderDetails';
import Address from '@/Pages/user/Address';
import EditAddress from '@/Pages/user/EditAddress';

 export default function App() {
  return (
    <>
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="shop" element={<Shop />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          
          {/* authenticated user navigation */}
          <Route path="account" element={<UserNavbar/>}>
            <Route index element={<Dashboard />} />
            <Route path="details" element={<AccountDetails />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order-details" element={<OrderDetails />} />
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