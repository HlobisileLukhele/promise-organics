import { IoMdArrowForward } from "react-icons/io";
import { FaLeaf } from "react-icons/fa";
import Products from "@/components/layout/Products";
import ServiceCard from "@/components/common/ServiceCard";
import { CiDeliveryTruck } from "react-icons/ci";
import { LuShieldCheck, LuCreditCard, LuPhoneCall } from "react-icons/lu";
import PromiseHairCare from '@/assets/Promise-hair-care.png';
import Shampoo from '@/assets/shampoo.png';
import HairOil from '@/assets/hair-oil.png';
import HairButter from '@/assets/butter.png';

const Home = () => {
    const products = [
        {
            id: 1,
            name: "Organic Shampoo",
            category: "Hair Care",
            price: "250",
            image: Shampoo
        },
        {
            id: 2,
            name: "Organic Hair Butter",
            category: "Hair Care",
            price: "200",
            image: HairButter
        },
        {
            id: 3,
            name: "Organic Hair Oil",
            category: "Hair Care",
            price: "180",
            image: HairOil
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
                {/* Decorative Background Elements - Light Brown Accents */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-[#c8a882]/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#c8a882]/6 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c8a882]/4 rounded-full blur-3xl"></div>
                
                {/* Floating Leaves Decoration */}
                <div className="absolute top-10 left-[10%] opacity-15">
                    <FaLeaf className="text-[#c8a882] text-4xl animate-pulse" />
                </div>
                <div className="absolute top-40 right-[15%] opacity-15">
                    <FaLeaf className="text-[#c8a882] text-3xl animate-pulse delay-75" />
                </div>
                <div className="absolute bottom-32 left-[20%] opacity-15">
                    <FaLeaf className="text-[#c8a882] text-5xl animate-pulse delay-150" />
                </div>

                <div className="container mx-auto px-4 py-12 md:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6 md:space-y-8 z-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-[#c8a882]/10 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-[#c8a882]/40 shadow-sm">
                                <FaLeaf className="text-[#7d9b7a] text-base font-bold" />
                                <span className="text-sm font-bold text-[#5a6c5a]">100% NATURAL & ORGANIC</span>
                            </div>

                            {/* Main Heading */}
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                                    <span className="text-[#3d4d3d] font-black">Natural Beauty</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-[#7d9b7a] to-[#c8a882] bg-clip-text text-transparent font-black">
                                        Is Pure Beauty
                                    </span>
                                </h1>
                                <div className="w-32 h-1.5 bg-gradient-to-r from-[#7d9b7a] via-[#c8a882] to-[#7d9b7a] rounded-full"></div>
                            </div>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-[#3d4d3d] font-medium leading-relaxed max-w-xl">
                                Nourish your hair with our <span className="font-bold text-[#7d9b7a]">organic haircare collection</span>. Infused with avocado and rosemary, 
                                crafted with love and <span className="font-bold text-[#c8a882]">100% natural ingredients</span>.
                            </p>

                            {/* Features List */}
                            <div className="grid grid-cols-2 gap-4 max-w-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-[#c8a882] rounded-full"></div>
                                    <span className="text-[#3d4d3d] text-sm md:text-base font-bold">Chemical Free</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-[#c8a882] rounded-full"></div>
                                    <span className="text-[#3d4d3d] text-sm md:text-base font-bold">Vegan Friendly</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-[#c8a882] rounded-full"></div>
                                    <span className="text-[#3d4d3d] text-sm md:text-base font-bold">Eco Packaging</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-[#c8a882] rounded-full"></div>
                                    <span className="text-[#3d4d3d] text-sm md:text-base font-bold">Cruelty Free</span>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a 
                                    href="#products" 
                                    className="group bg-[#7d9b7a] hover:bg-[#5a6c5a] text-white font-bold text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <span>SHOP COLLECTION</span>
                                    <IoMdArrowForward className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
                                </a>
                                <a 
                                    href="#about" 
                                    className="group bg-[#c8a882] hover:bg-[#b89872] text-white font-bold text-lg px-10 py-5 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <span>LEARN MORE</span>
                                </a>
                            </div>
                        </div>

                        {/* Right Content - Product Showcase */}
                        <div className="relative z-10 hidden lg:block">
                            <div className="relative">
                                {/* Main Product Image Container */}
                                <div className="relative bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-[#c8a882]/20">
                                    {/* Decorative Circle */}
                                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#c8a882] rounded-full opacity-15 blur-2xl"></div>
                                    <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#7d9b7a] rounded-full opacity-15 blur-2xl"></div>
                                    
                                    {/* Product Image Placeholder */}
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#f5f1e8] to-[#faf8f5] border-2 border-[#c8a882]/30">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                     <img src={PromiseHairCare} alt="about-hero" className="object-cover hidden md:block h-[400px] md:mt-8" />        
                                        </div>
                                    </div>
                                    
                                    {/* Floating Product Cards */}
                                    <div className="absolute -left-8 top-1/4 bg-white rounded-2xl p-4 shadow-2xl border-2 border-[#c8a882]/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-[#c8a882]/20 flex items-center justify-center">
                                                <span className="text-2xl">🥑</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#3d4d3d]">Avocado Oil</p>
                                                <p className="text-xs text-[#7d9b7a] font-bold">Deep Moisture</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -right-8 bottom-1/3 bg-white rounded-2xl p-4 shadow-2xl border-2 border-[#7d9b7a]/30 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-[#7d9b7a]/20 flex items-center justify-center">
                                                <span className="text-2xl">🌿</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#3d4d3d]">Rosemary</p>
                                                <p className="text-xs text-[#c8a882] font-bold">Hair Growth</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <div id="products" className="py-20 bg-white relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-[#c8a882]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#7d9b7a]/5 rounded-full blur-3xl"></div>
                
                <Products
                    title="Featured Products" 
                    products={products} 
                />
            </div>

            {/* Services Section */}
            <div className="bg-gradient-to-br from-[#f5f1e8] via-white to-[#faf8f5] py-20 border-y-2 border-[#c8a882]/10 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c8a882]/5 rounded-full blur-3xl"></div>
                
                <div className="w-11/12 max-w-7xl mx-auto">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border-2 border-[#c8a882]/40 shadow-sm mb-4">
                            <span className="text-sm font-bold text-[#3d4d3d]">WHY CHOOSE PROMISE ORGANICS </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#3d4d3d] mb-4">
                            We Care About Your Experience
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-[#7d9b7a] via-[#c8a882] to-[#7d9b7a] rounded-full mx-auto"></div>
                    </div>

                    {/* Service Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-4">
                        <ServiceCard
                            icon={CiDeliveryTruck}
                            title="Fast Delivery"
                            description="Free shipping on orders over R500"
                        />
                        <ServiceCard
                            icon={LuShieldCheck}
                            title="Money Back Guarantee"
                            description="30 days return policy"
                        />
                        <ServiceCard
                            icon={LuCreditCard}
                            title="Secure Payment"
                            description="Protected transactions"
                        />
                        <ServiceCard
                            icon={LuPhoneCall}
                            title="24/7 Support"
                            description="Always here to help"
                        />
                    </div>
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="py-20 px-20 bg-white relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#7d9b7a]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#c8a882]/5 rounded-full blur-3xl"></div>
                
                <Products
                    title="Best Sellers" 
                    products={products} 
                />
            </div>
        </>
    )
}

export default Home