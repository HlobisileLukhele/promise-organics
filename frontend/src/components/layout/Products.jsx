import ProductDetail from "@/Pages/ProductDetail";
import { IoMdArrowForward, IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import fallbackImg from "@/assets/butter.png";

const Products = ({
  title = "Featured Products",
  viewAllLink = "#",
  products = [],
  shop = false,
}) => {
  const addToCart     = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);

  const gridClass = shop
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 my-8"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-8";

  return (
    <div className={`w-11/12 max-w-7xl mt-10 mx-auto ${shop && 'mt-0'}`}>
      <div className="flex justify-between items-center flex-wrap gap-y-4 mb-10">
        <h2 className="text-3xl md:text-4xl text-[#3d4f3e] font-semibold title">{title}</h2>
        <a href={viewAllLink} className="flex gap-x-1 items-center hover:underline text-[#7c8c7d]">
          <span className="capitalize">View All</span>
          <IoMdArrowForward />
        </a>
      </div>

      <div className={gridClass}>
        {products.map((product) => {
          const image      = product.image || product.image_url || fallbackImg;
          const outOfStock = product.in_stock === false;
          return (
            <div
              key={product.id}
              className={`group bg-white dark:bg-[#162d20] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300${outOfStock ? ' opacity-70' : ''}`}
            >
              {/* Image container */}
              <div className="w-full aspect-square overflow-hidden bg-[#f7faf8] dark:bg-[#1e3d2a] flex items-center justify-center rounded-t-xl relative">
                {product.onSale && (
                  <div className="absolute top-3 left-3 z-10 bg-[#4a5fa8] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Sale
                  </div>
                )}
                {outOfStock && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = fallbackImg; }}
                />
                <ProductDetail product={product} />
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-[#f0f7f2] mb-1 leading-snug min-h-[40px] line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 dark:text-[#7a9e85] line-through">{product.originalPrice}</span>
                  )}
                  <p className="text-[#4a7c59] dark:text-[#7a9e85] font-bold text-base">R{product.price}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart({
                      id:       product.id,
                      name:     product.name,
                      image,
                      price:    parseFloat(product.price),
                      quantity: 1,
                    })}
                    disabled={outOfStock}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-colors ${
                      outOfStock
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-[#4a7c59] hover:bg-[#2d5a3d] text-white'
                    }`}
                  >
                    <HiOutlineShoppingBag size={14} className="shrink-0" />
                    {outOfStock ? 'N/A' : 'CART'}
                  </button>
                  <button
                    onClick={() => addToWishlist({
                      id:    product.id,
                      name:  product.name,
                      image,
                      price: product.price,
                    })}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-[#2d5a3d] text-gray-600 dark:text-[#c8dece] hover:border-[#4a7c59] hover:text-[#4a7c59] text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    <IoMdHeartEmpty size={14} className="shrink-0" />
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
