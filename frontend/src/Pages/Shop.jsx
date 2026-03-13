import { useState, useMemo, useEffect } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import Products from "@/components/layout/Products";
import ReviewForm from "@/components/sections/ReviewForm";

const Shop = () => {
  const [products, setProducts]           = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm]       = useState("");
  const [priceMin, setPriceMin]           = useState("");
  const [priceMax, setPriceMax]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags]   = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(({ data }) => {
        const normalised = (data || []).map((p) => ({
          ...p,
          tags: p.category ? [p.category.toLowerCase().replace(/\s+/g, "-")] : [],
        }));
        setProducts(normalised);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const categories = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (p.category) map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  const tags = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return [...set];
  }, [products]);

  const handleReset = () => {
    setSearchTerm("");
    setPriceMin("");
    setPriceMax("");
    setSelectedCategory("");
    setSelectedTags([]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesPrice    =
        (!priceMin || parseFloat(p.price) >= parseFloat(priceMin)) &&
        (!priceMax || parseFloat(p.price) <= parseFloat(priceMax));
      const matchesTags     =
        selectedTags.length === 0 || selectedTags.every((tag) => p.tags?.includes(tag));
      return matchesSearch && matchesCategory && matchesPrice && matchesTags;
    });
  }, [products, searchTerm, priceMin, priceMax, selectedCategory, selectedTags]);

  return (
    <div className="w-11/12 mx-auto mt-8">
      {/* Top search bar */}
      <div className="w-full max-w-xl mx-auto mb-8 px-4">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 dark:text-[#7a9e85] size-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#2d5a3d] rounded-full bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] focus:outline-none focus:border-[#7c8c7d] focus:ring-2 focus:ring-[#7c8c7d]/20 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col md:items-baseline md:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 border border-gray-200 dark:border-[#2d5a3d] rounded-xl p-5 space-y-6 dark:bg-[#1e3d2a]">
          <div className="flex items-center gap-2 text-base text-gray-700 dark:text-[#c8dece]">
            <FiFilter className="text-gray-500 dark:text-[#7a9e85]" />
            <span>Filter</span>
          </div>

          <div className="mb-16">
            <h3 className="text-base font-medium mb-2 dark:text-[#f0f7f2]">Price</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] rounded-xs outline-none focus-within:border-gray-500 dark:focus-within:border-[#4a7c59]"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] rounded-xs outline-none focus-within:border-gray-500 dark:focus-within:border-[#4a7c59]"
              />
            </div>
          </div>

          {Object.keys(categories).length > 0 && (
            <div>
              <h3 className="text-base font-medium mb-2 dark:text-[#f0f7f2]">Category</h3>
              <ul className="space-y-1 mt-3">
                {Object.entries(categories).map(([cat, count]) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                      className={`flex justify-between w-full text-sm text-left px-2 py-1 hover:cursor-pointer hover:text-teal-800 dark:hover:text-[#4a7c59] rounded-md dark:text-[#c8dece] ${
                        selectedCategory === cat ? "text-teal-800 dark:text-[#4a7c59] font-semibold" : ""
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-sm text-gray-500 dark:text-[#7a9e85]">({count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-10">
              <h3 className="text-base font-medium mb-5 dark:text-[#f0f7f2]">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`px-4 py-2 cursor-pointer bg-gray-200 dark:bg-[#162d20] hover:bg-teal-800 dark:hover:bg-[#2d5a3d] hover:text-white capitalize transform duration-200 text-sm ${
                      selectedTags.includes(tag) ? "bg-teal-500 dark:bg-[#2d5a3d] text-white" : "text-gray-600 dark:text-[#c8dece]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2 mt-4 bg-teal-800 text-white hover:bg-teal-700 cursor-pointer uppercase text-sm font-medium"
          >
            Reset
          </button>
        </aside>

        {loadingProducts ? (
          <div className="flex-1 flex items-center justify-center py-20 text-gray-400 dark:text-[#7a9e85] text-sm">
            Loading products…
          </div>
        ) : (
          <Products title="Shop All" products={filteredProducts} shop={true} />
        )}
      </div>

      <ReviewForm />
    </div>
  );
};

export default Shop;
