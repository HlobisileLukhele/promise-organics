import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { LiaTimesSolid } from "react-icons/lia";
import Footer from './Footer';
import promiseLogo from "@/assets/promise-logo.png";
import { CiShoppingCart, CiSearch, CiUser, CiHeart } from "react-icons/ci";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const [showHeartDrawer, setShowHeartDrawer] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearchDrawer = () => setShowSearchDrawer(!showSearchDrawer);
  const toggleHeartDrawer = () => setShowHeartDrawer(!showHeartDrawer);
  const toggleCartDrawer = () => setShowCartDrawer(!showCartDrawer);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = (path) =>
    `hover:text-[#c8937b] ${location.pathname === path ? 'text-[#c8937b]' : ''}`;

  return (
    <>
      <header className={`bg-white shadow-sm w-full z-50 transition-all duration-300 ease-in-out ${isSticky ? 'sticky top-0' : ''}`}>
        <nav className="flex justify-between items-center px-4 lg:px-20 py-2">
          <div className="flex items-left gap-3">
            <Link to="/">
              <img
                src={promiseLogo}
                alt="Logo"
                className="w-45 h-20 rounded-md object-contain"
              />
            </Link>
          </div>

          <ul className="hidden lg:flex gap-10 text-gray-500 font-medium text-base uppercase items-center">
            <li><Link to="/" className={navLinkClass("/")}>Home</Link></li>
            <li><Link to="/shop" className={navLinkClass("/shop")}>Shop</Link></li>
            <li><Link to="/about" className={navLinkClass("/about")}>About</Link></li>
            <li><Link to="/contact" className={navLinkClass("/contact")}>Contact</Link></li>
          </ul>

          <div className="flex items-center gap-x-4 text-2xl text-gray-700">
            <Link to="/login">
              <CiUser className="cursor-pointer hover:text-[#c8937b]" />
            </Link>

            <CiSearch onClick={toggleSearchDrawer} className="cursor-pointer hover:text-[#c8937b]" />

            <div
              onClick={toggleHeartDrawer}
              className="relative flex items-center justify-center h-6 w-6 cursor-pointer group"
            >
              <CiHeart className="group-hover:text-[#c8937b]" />
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-[#7c8c7d] text-white">
                0
              </span>
            </div>

            <div
              onClick={toggleCartDrawer}
              className="relative flex items-center justify-center h-6 w-6 cursor-pointer group"
            >
              <CiShoppingCart className="group-hover:text-[#c8937b]" />
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-[#7c8c7d] text-white">
                0
              </span>
            </div>

            <FaBars className="lg:hidden cursor-pointer" onClick={toggleMenu} />
          </div>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-5 transition-transform">
            <div className="flex justify-end mb-4">
              <LiaTimesSolid
                className="text-2xl cursor-pointer hover:text-[#c8937b]"
                onClick={toggleMenu}
              />
            </div>
            <ul className="flex flex-col gap-5 text-gray-700 text-lg">
              <li><Link to="/" className="text-[#c8937b] font-bold" onClick={toggleMenu}>Home</Link></li>
              <li><Link to="/about" className="hover:text-[#c8937b]" onClick={toggleMenu}>About</Link></li>
              <li><Link to="/shop" className="hover:text-[#c8937b]" onClick={toggleMenu}>Shop</Link></li>
              <li><Link to="/contact" className="hover:text-[#c8937b]" onClick={toggleMenu}>Contact</Link></li>
            </ul>
          </div>
        )}
      </header>

      {showSearchDrawer && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center flex-col transition-all duration-300">
          <button
            onClick={toggleSearchDrawer}
            className="absolute top-4 right-6 text-2xl hover:text-[#c8937b] hover:cursor-pointer"
          >
            <LiaTimesSolid />
          </button>
          <div className="relative w-4/5 max-w-xl">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-md px-12 py-3 text-lg focus:outline-none"
            />
            <CiSearch className="absolute top-4 left-4 text-gray-400 size-6" />
          </div>
        </div>
      )}

      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-6 transition-transform duration-300 transform ${showHeartDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={toggleHeartDrawer}
          className="absolute top-4 right-4 text-xl hover:text-[#c8937b] hover:cursor-pointer"
        >
          <LiaTimesSolid />
        </button>
        <div className="mt-14 flex flex-col items-center text-center">
          <CiHeart className="text-3xl text-gray-400 mb-3" />
          <h2 className="text-xl font-semibold mb-2">Your Wishlist</h2>
          <p className="text-gray-500">Your wishlist is currently empty.</p>
        </div>
      </div>

      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-6 transition-transform duration-300 transform ${showCartDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={toggleCartDrawer}
          className="absolute top-4 right-4 text-xl hover:text-[#c8937b] hover:cursor-pointer"
        >
          <LiaTimesSolid />
        </button>
        <div className="mt-14 flex flex-col items-center text-center">
          <HiOutlineShoppingBag className="text-3xl text-gray-400 mb-3" />
          <h2 className="text-xl font-semibold mb-2">Shopping Cart</h2>
          <p className="text-gray-500">Your shopping cart is currently empty.</p>
        </div>
      </div>

      <Outlet />
      <Footer />
    </>
  );
};

export default Navbar;
