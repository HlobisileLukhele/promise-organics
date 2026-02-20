import ProductDetail from "@/pages/ProductDetail";
import { IoMdArrowForward } from "react-icons/io";

const Products = ({
  title = "Featured Products",
  viewAllLink = "#",
  products = [],
  shop = false,
}) => {
  const gridClass = shop
    ? "grid md:grid-cols-3 gap-6 my-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 my-8";

  return (
    <div className={`w-11/12 max-w-7xl mt-10 mx-auto ${shop && 'mt-0'}`}>
      <div className="flex justify-between items-center flex-wrap gap-y-4 mb-10">
        <h2 className="text-3xl md:text-4xl text-[#3d4f3e] font-semibold title">{title}</h2>
        <a
          href={viewAllLink}
          className="flex gap-x-1 items-center hover:underline text-[#7c8c7d]"
        >
          <span className="capitalize">View All</span>
          <IoMdArrowForward />
        </a>
      </div>

      <div className={gridClass}>
        {products.map((product, index) => (
          <div
            key={index}
            className="group relative overflow-hidden"
          >
            {/* Product Image Container with Light Gray Background */}
            <div className="relative bg-gray-100 rounded-2xl p-8 md:p-10 flex items-center justify-center min-h-[380px] md:min-h-[420px] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              {/* Sale Badge */}
              {product.onSale && (
                <div className="absolute top-5 left-5 bg-[#4a5fa8] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide z-10 shadow-lg">
                  Sale
                </div>
              )}
              
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full max-h-[320px] md:max-h-[360px] object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
              />
            </div>

            {/* Product Details */}
            <div className="pt-5 pb-2">
              {/* Product Name */}
              <h2 className="text-base md:text-lg font-semibold text-[#3d4f3e] mb-2 leading-snug min-h-[3rem] line-clamp-2">
                {product.name}
              </h2>
              
              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-[#c9a96e]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                      {product.rating && i < Math.floor(product.rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                {product.reviews && (
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.originalPrice}
                  </span>
                )}
                <h2 className="text-lg md:text-xl font-bold text-[#3d4f3e]">R{product.price}</h2>
              </div>
            </div>

            {/* ProductDetail Component handles the quick view button and modal */}
            <ProductDetail />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;