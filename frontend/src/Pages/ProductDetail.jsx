import { useState, useEffect } from "react";
import { PiEyeBold } from "react-icons/pi";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";
import { GoStarFill } from "react-icons/go";
import { IoStarHalf } from "react-icons/io5";
import { FiStar } from "react-icons/fi";
import Butter from '@/assets/butter.png'
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function ProductDetail({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);

  const addQuantity = () => setQuantity((prev) => prev + 1);

  const minusQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '') { setQuantity(''); return; }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) setQuantity(numValue);
  };

  const productImage = product?.image || product?.image_url || Butter;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      image: productImage,
      price: parseFloat(product.price),
      quantity: quantity || 1,
    });
    setIsOpen(false);
  };

  const openModal = () => { setQuantity(1); setIsOpen(true); };
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') closeModal(); };
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={openModal}
        className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex w-12 h-12 items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center rounded-full bg-white shadow-lg hover:shadow-xl z-20"
      >
        <PiEyeBold className="text-xl text-[#3d4f3e]" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(128, 128, 128, 0.4)' }}
          onClick={closeModal}
        >
          <div
            className="relative bg-white dark:bg-[#1e3d2a] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-[#f5f5f0] dark:bg-[#162d20] hover:bg-[#e8e8e0] dark:hover:bg-[#0f1f17] transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3d4f3e] dark:text-[#c8dece]">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Content */}
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Product Image */}
              <div className="w-full md:w-1/2 bg-[#f7faf8] dark:bg-[#162d20] rounded-xl flex items-center justify-center min-h-[320px] md:min-h-[460px] p-4">
                <img
                  src={productImage}
                  alt={product?.name || "Product image"}
                  className="w-full h-full object-contain max-h-[440px] drop-shadow-lg transition-transform duration-500 hover:scale-105"
                  onError={(e) => { e.target.src = Butter; }}
                />
              </div>

              {/* Right Side - Product Details */}
              <div className="md:w-1/2 w-full p-6 md:p-10">
                {/* Product Title */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3d4f3e] dark:text-[#f0f7f2]">
                  {product?.name || "Product"}
                </h2>

                {/* Star Rating */}
                <div className="flex items-center gap-x-2 mb-6">
                  <div className="flex items-center gap-x-0.5">
                    <GoStarFill className="text-[#c9a96e] text-lg" />
                    <GoStarFill className="text-[#c9a96e] text-lg" />
                    <GoStarFill className="text-[#c9a96e] text-lg" />
                    <IoStarHalf className="text-[#c9a96e] text-lg" />
                    <FiStar className="text-gray-300 text-lg" />
                  </div>
                  <span className="text-sm text-[#7c8c7d]">(10 customer reviews)</span>
                </div>

                {/* Product Description */}
                <p className="text-[#5a5a5a] dark:text-[#7a9e85] leading-relaxed mb-8 text-base">
                  {product?.description || "Natural organic product for your hair care routine."}
                </p>

                {/* Price and Quantity Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-[#3d4f3e] dark:text-[#f0f7f2] mb-2">Price</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#3d4f3e] dark:text-[#f0f7f2]">
                          R{product?.price || "0"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-[#3d4f3e] dark:text-[#f0f7f2] mb-2">Quantity</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={minusQuantity}
                          className="w-10 h-10 flex items-center justify-center bg-[#f5f5f0] dark:bg-[#162d20] hover:bg-[#e8e8e0] dark:hover:bg-[#0f1f17] transition-colors duration-200 text-[#3d4f3e] dark:text-[#f0f7f2]"
                        >
                          <FiMinus className="text-lg" />
                        </button>
                        <input
                          type="text"
                          name="quantity"
                          className="w-16 h-10 border border-[#e8e8e0] dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] text-center text-base font-semibold focus:outline-none focus:border-[#7c8c7d] transition-colors duration-200 text-[#3d4f3e]"
                          value={quantity === '' ? '' : quantity}
                          onChange={handleQuantityChange}
                        />
                        <button
                          onClick={addQuantity}
                          className="w-10 h-10 flex items-center justify-center bg-[#f5f5f0] dark:bg-[#162d20] hover:bg-[#e8e8e0] dark:hover:bg-[#0f1f17] transition-colors duration-200 text-[#3d4f3e] dark:text-[#f0f7f2]"
                        >
                          <FiPlus className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={handleAddToCart}
                      className="bg-[#7c8c7d] hover:bg-[#6b7a6c] text-white px-6 py-3 font-semibold uppercase text-sm tracking-wide transition-all duration-300"
                    >
                      Add To Cart
                    </button>
                    <button
                      onClick={() => product && addToWishlist({ id: product.id, name: product.name, image: productImage, price: product.price })}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-[#2d5a3d] hover:bg-[#f5f5f0] dark:hover:bg-[#162d20] font-medium transition-colors duration-200 text-[#3d4f3e] dark:text-[#f0f7f2]"
                    >
                      <IoMdHeartEmpty className="text-xl" />
                      <span>Add To Wishlist</span>
                    </button>
                  </div>
                </div>

                {/* Product Meta Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-x-2">
                    <span className="font-semibold text-[#3d4f3e] dark:text-[#c8dece] uppercase text-sm">Category:</span>
                    <span className="text-[#5a5a5a] dark:text-[#7a9e85]">{product?.category || "—"}</span>
                  </div>
                </div>

                {/* Ingredients */}
                {product?.ingredients && (
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-[#2d5a3d]">
                    <h4 className="text-sm font-semibold text-[#2d5a3d] dark:text-[#4a7c59] uppercase tracking-wider mb-2">
                      🌿 Ingredients
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-[#7a9e85] leading-relaxed">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {/* Directions */}
                {product?.directions && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2d5a3d]">
                    <h4 className="text-sm font-semibold text-[#2d5a3d] dark:text-[#4a7c59] uppercase tracking-wider mb-3">
                      📋 Directions for Use
                    </h4>
                    <ol className="space-y-2">
                      {product.directions.split('|').map((step, index) => (
                        <li key={index} className="flex gap-3 text-sm text-gray-600 dark:text-[#7a9e85]">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4a7c59] text-white text-xs flex items-center justify-center font-medium mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">
                            {step.replace(/^\d+\.\s*/, '').trim()}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
