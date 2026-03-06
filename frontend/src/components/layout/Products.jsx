import ProductDetail from "@/Pages/ProductDetail";
import { IoMdArrowForward, IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

const Products = ({
  title = "Featured Products",
  viewAllLink = "#",
  products = [],
  shop = false,
}) => {
  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);

  const gridClass = shop
    ? "grid md:grid-cols-3 gap-6 my-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 my-8";

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
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden flex flex-col">
            {/* Product Image */}
            <div className="relative bg-gray-100 rounded-2xl p-8 md:p-10 flex items-center justify-center min-h-[380px] md:min-h-[420px] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              {product.onSale && (
                <div className="absolute top-5 left-5 bg-[#4a5fa8] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide z-10 shadow-lg">
                  Sale
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full max-h-[320px] md:max-h-[360px] object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
              />
              {/* Quick view eye button */}
              <ProductDetail product={product} />
            </div>

            {/* Product Details */}
            <div className="pt-5 pb-2 flex-1">
              <h2 className="text-base md:text-lg font-semibold text-[#3d4f3e] mb-2 leading-snug min-h-[3rem] line-clamp-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                )}
                <h2 className="text-lg md:text-xl font-bold text-[#3d4f3e]">R{product.price}</h2>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button
                onClick={() => addToCart({ id: product.id, name: product.name, image: product.image, price: parseFloat(product.price), quantity: 1 })}
                className="flex items-center justify-center gap-2 bg-[#7c8c7d] hover:bg-[#6b7a6c] text-white px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-all duration-300"
              >
                <HiOutlineShoppingBag className="text-base shrink-0" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => addToWishlist({ id: product.id, name: product.name, image: product.image, price: product.price })}
                className="flex items-center justify-center gap-2 border border-[#7c8c7d] text-[#7c8c7d] hover:bg-[#7c8c7d] hover:text-white px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-all duration-300"
              >
                <IoMdHeartEmpty className="text-base shrink-0" />
                <span>Wishlist</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
