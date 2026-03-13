import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { LiaTimesSolid } from "react-icons/lia";
import { FiTrash2 } from "react-icons/fi";
import Footer from './Footer';
import promiseLogo from "@/assets/promise-logo.png";
import { CiShoppingCart, CiUser, CiHeart } from "react-icons/ci";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUserStore } from "@/store/userStore";
import ThemeToggle from "@/components/common/ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeartDrawer, setShowHeartDrawer] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  const cartItems = useCartStore((state) => state.items);
  const removeCartItem = useCartStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleHeartDrawer = () => setShowHeartDrawer(!showHeartDrawer);
  const toggleCartDrawer = () => setShowCartDrawer(!showCartDrawer);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = (path) =>
    `hover:text-[#c8937b] ${location.pathname === path ? 'text-[#c8937b]' : ''}`;

  return (
    <>
      <header className={`bg-white dark:bg-[#0f1f17] shadow-sm dark:shadow-[#2d5a3d]/30 w-full z-50 transition-all duration-300 ease-in-out ${isSticky ? 'sticky top-0' : ''}`}>
        <nav className="flex justify-between items-center px-4 lg:px-20 py-2">
          <div className="flex items-left gap-3">
            <Link to="/">
              <img src={promiseLogo} alt="Logo" className="w-45 h-20 rounded-md object-contain" />
            </Link>
          </div>

          <ul className="hidden lg:flex gap-10 text-gray-500 dark:text-[#c8dece] font-medium text-base uppercase items-center">
            <li><Link to="/" className={navLinkClass("/")}>Home</Link></li>
            <li><Link to="/shop" className={navLinkClass("/shop")}>Shop</Link></li>
            <li><Link to="/about" className={navLinkClass("/about")}>About</Link></li>
            <li><Link to="/blog" className={navLinkClass("/blog")}>Blog</Link></li>
            <li><Link to="/contact" className={navLinkClass("/contact")}>Contact</Link></li>
          </ul>

          <div className="flex items-center gap-x-4 text-2xl text-gray-700 dark:text-[#c8dece]">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/account" className="text-sm font-medium text-gray-700 dark:text-[#c8dece] hidden sm:block hover:text-[#7c8c7d]">
                  Welcome, <span className="text-[#7c8c7d] font-semibold">{user.full_name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-gray-500 dark:text-[#7a9e85] hover:text-[#c8937b] border border-gray-200 dark:border-[#2d5a3d] px-2 py-1 rounded hidden sm:block cursor-pointer"
                >
                  Logout
                </button>
                <Link to="/account"><CiUser className="text-[#7c8c7d] sm:hidden" /></Link>
              </div>
            ) : (
              <Link to="/login">
                <CiUser className="cursor-pointer hover:text-[#c8937b]" />
              </Link>
            )}

            <ThemeToggle />

            <div onClick={toggleHeartDrawer} className="relative flex items-center justify-center h-6 w-6 cursor-pointer group">
              <CiHeart className="group-hover:text-[#c8937b]" />
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-[#7c8c7d] text-white">
                {wishlistCount}
              </span>
            </div>

            <div onClick={toggleCartDrawer} className="relative flex items-center justify-center h-6 w-6 cursor-pointer group">
              <CiShoppingCart className="group-hover:text-[#c8937b]" />
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-[#7c8c7d] text-white">
                {cartCount}
              </span>
            </div>

            <FaBars className="lg:hidden cursor-pointer" onClick={toggleMenu} />
          </div>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden fixed top-0 right-0 w-64 h-full bg-white dark:bg-[#0f1f17] shadow-lg z-50 p-5 transition-transform">
            <div className="flex justify-end mb-4">
              <LiaTimesSolid className="text-2xl cursor-pointer hover:text-[#c8937b] dark:text-[#c8dece]" onClick={toggleMenu} />
            </div>
            <ul className="flex flex-col gap-5 text-gray-700 dark:text-[#c8dece] text-lg">
              <li><Link to="/" className="text-[#c8937b] font-bold" onClick={toggleMenu}>Home</Link></li>
              <li><Link to="/about" className="hover:text-[#c8937b]" onClick={toggleMenu}>About</Link></li>
              <li><Link to="/shop" className="hover:text-[#c8937b]" onClick={toggleMenu}>Shop</Link></li>
              <li><Link to="/blog" className="hover:text-[#c8937b]" onClick={toggleMenu}>Blog</Link></li>
              <li><Link to="/contact" className="hover:text-[#c8937b]" onClick={toggleMenu}>Contact</Link></li>
            </ul>
          </div>
        )}
      </header>


      {/* Wishlist Drawer */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-[#1e3d2a] shadow-lg z-50 p-6 transition-transform duration-300 transform ${showHeartDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={toggleHeartDrawer} className="absolute top-4 right-4 text-xl text-gray-700 dark:text-[#c8dece] hover:text-[#c8937b] hover:cursor-pointer">
          <LiaTimesSolid />
        </button>
        <h2 className="text-xl font-semibold mt-14 mb-4 dark:text-[#f0f7f2]">Your Wishlist ({wishlistCount})</h2>
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-8">
            <CiHeart className="text-3xl text-gray-400 dark:text-[#7a9e85] mb-3" />
            <p className="text-gray-500 dark:text-[#7a9e85]">Your wishlist is currently empty.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-120px)]">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 dark:border-[#2d5a3d] pb-4">
                <img src={item.image} alt={item.name} className="w-14 h-16 object-contain bg-gray-50 dark:bg-[#162d20] rounded" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#3d4f3e] dark:text-[#f0f7f2] line-clamp-2">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-[#7a9e85] mt-1">R{parseFloat(item.price).toFixed(2)}</p>
                </div>
                <button onClick={() => removeWishlistItem(item.id)} className="text-red-400 hover:text-red-600 cursor-pointer">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-[#1e3d2a] shadow-lg z-50 p-6 transition-transform duration-300 transform ${showCartDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={toggleCartDrawer} className="absolute top-4 right-4 text-xl text-gray-700 dark:text-[#c8dece] hover:text-[#c8937b] hover:cursor-pointer">
          <LiaTimesSolid />
        </button>
        <h2 className="text-xl font-semibold mt-14 mb-4 dark:text-[#f0f7f2]">Shopping Cart ({cartCount})</h2>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-8">
            <HiOutlineShoppingBag className="text-3xl text-gray-400 dark:text-[#7a9e85] mb-3" />
            <p className="text-gray-500 dark:text-[#7a9e85]">Your shopping cart is currently empty.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-220px)]">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 dark:border-[#2d5a3d] pb-4">
                <img src={item.image} alt={item.name} className="w-14 h-16 object-contain bg-gray-50 dark:bg-[#162d20] rounded" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#3d4f3e] dark:text-[#f0f7f2] line-clamp-2">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-[#7a9e85] mt-1">x{item.quantity} · R{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeCartItem(item.id)} className="text-red-400 hover:text-red-600 cursor-pointer">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 dark:border-[#2d5a3d] bg-white dark:bg-[#1e3d2a]">
            <div className="flex justify-between text-sm font-semibold mb-4 dark:text-[#f0f7f2]">
              <span>Total</span>
              <span>R{cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}</span>
            </div>
            <Link to="/cart" onClick={toggleCartDrawer}>
              <button className="w-full bg-[#7c8c7d] text-white py-3 font-semibold hover:opacity-90">
                View Cart
              </button>
            </Link>
          </div>
        )}
      </div>

      <Outlet />
      <Footer />
    </>
  );
};

export default Navbar;
