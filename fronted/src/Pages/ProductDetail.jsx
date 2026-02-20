import { useState, useEffect } from "react";
import { PiEyeBold } from "react-icons/pi";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";
import { GoStarFill } from "react-icons/go";
import { IoStarHalf } from "react-icons/io5";
import { FiStar } from "react-icons/fi";
import Butter from '@/assets/butter.png'

export default function ProductDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const minusQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setQuantity(numValue);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={openModal}
        className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex w-12 h-12 items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-20"
      >
        <PiEyeBold className="text-xl text-[#3d4f3e]" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(128, 128, 128, 0.4)' }}
          onClick={closeModal}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-[#f5f5f0] hover:bg-[#e8e8e0] transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#3d4f3e" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
              
            {/* Modal Content */}
            <div className="flex flex-col md:flex-row h-full max-h-[95vh] overflow-y-auto">
              {/* Left Side - Product Image */}
              <div className="md:w-1/2 w-full bg-white flex items-center justify-center p-8 md:p-12 min-h-[300px] md:min-h-[600px]">
                <img 
                  src={Butter} 
                  alt="Product image" 
                  className="object-contain max-h-[400px] md:max-h-[500px] w-full drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Right Side - Product Details */}
              <div className="md:w-1/2 w-full p-6 md:p-10 overflow-y-auto">
                {/* Sale Badge */}
                <div className="inline-block px-4 py-1.5 mb-4 bg-[#7c8c7d] text-white text-xs font-semibold uppercase tracking-wide rounded-sm">
                  Sale 20% Off
                </div>

                {/* Product Title */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3d4f3e]">
                  Organic Hair Oil
                </h2>

                {/* Star Rating */}
                <div className="flex items-center gap-x-2 mb-6">
                  <div className="flex items-center gap-x-0.5">
                    <GoStarFill className="text-[#c9a96e] text-lg"/>
                    <GoStarFill className="text-[#c9a96e] text-lg"/>
                    <GoStarFill className="text-[#c9a96e] text-lg"/>
                    <IoStarHalf className="text-[#c9a96e] text-lg"/>
                    <FiStar className="text-gray-300 text-lg"/>
                  </div>
                  <span className="text-sm text-[#7c8c7d]">(10 customer reviews)</span>
                </div>

                {/* Product Description */}
                <p className="text-[#5a5a5a] leading-relaxed mb-8 text-base">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam ipsum laborum architecto quae debitis, praesentium quasi cum maiores a assumenda!
                </p>

                {/* Price and Quantity Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-[#3d4f3e] mb-2">Price</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#3d4f3e]">R150.00</span>
                        <span className="text-base text-gray-400 line-through">R180.00</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold text-[#3d4f3e] mb-2">Quantity</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={minusQuantity}
                          className="w-10 h-10 flex items-center justify-center bg-[#f5f5f0] hover:bg-[#e8e8e0] transition-colors duration-200 text-[#3d4f3e]"
                        >
                          <FiMinus className="text-lg" />
                        </button>
                        <input
                          type="text"
                          name="quantity"
                          className="w-16 h-10 border border-[#e8e8e0] text-center text-base font-semibold focus:outline-none focus:border-[#7c8c7d] transition-colors duration-200 text-[#3d4f3e]"
                          value={quantity === '' ? '' : quantity}
                          onChange={handleQuantityChange}
                        />
                        <button
                          onClick={addQuantity}
                          className="w-10 h-10 flex items-center justify-center bg-[#f5f5f0] hover:bg-[#e8e8e0] transition-colors duration-200 text-[#3d4f3e]"
                        >
                          <FiPlus className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <button className="bg-[#7c8c7d] hover:bg-[#6b7a6c] text-white px-6 py-3 font-semibold uppercase text-sm tracking-wide transition-all duration-300">
                      Add To Cart
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:bg-[#f5f5f0] font-medium transition-colors duration-200 text-[#3d4f3e]">
                      <IoMdHeartEmpty className="text-xl" /> 
                      <span>Add To Wishlist</span>
                    </button>
                  </div>
                </div>

                {/* Product Meta Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-x-2">
                    <span className="font-semibold text-[#3d4f3e] uppercase text-sm">SKU:</span>
                    <span className="text-[#5a5a5a]">CLT584E63A</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="font-semibold text-[#3d4f3e] capitalize text-sm">Category:</span>
                    <span className="text-[#5a5a5a]">Haircare, Oil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes appear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}