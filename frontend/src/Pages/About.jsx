import { FaLeaf, FaHeart, FaStar, FaUsers } from "react-icons/fa";
import { GiChemicalDrop } from "react-icons/gi";
import { IoMdArrowForward } from "react-icons/io";

const About = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-white">
                {/* Background Decorations */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-[#c8a882]/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#c8a882]/6 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7d9b7a]/4 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#c8a882]/10 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-[#c8a882]/40 shadow-sm mb-6">
                            <FaLeaf className="text-[#7d9b7a] text-base font-bold" />
                            <span className="text-sm font-bold text-[#5a6c5a]">OUR STORY</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                            <span className="text-[#3d4d3d] font-black">Where Passion Meets</span>
                            <br />
                            <span className="bg-gradient-to-r from-[#7d9b7a] to-[#c8a882] bg-clip-text text-transparent font-black">
                                Natural Beauty
                            </span>
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-[#7d9b7a] via-[#c8a882] to-[#7d9b7a] rounded-full mx-auto mb-8"></div>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-[#3d4d3d] font-medium leading-relaxed max-w-3xl mx-auto">
                            Founded in late 2025 by Promise, a dedicated <span className="font-bold text-[#7d9b7a]">hairstylist and braider</span>, 
                            our brand emerged from a genuine passion for solving real hair problems with <span className="font-bold text-[#c8a882]">100% natural solutions</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Founder Story Section */}
            <section className="py-20 bg-gradient-to-br from-[#f5f1e8] via-white to-[#faf8f5] relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c8a882]/5 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Image Side */}
                            <div className="relative">
                                <div className="relative bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-[#c8a882]/20">
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#f5f1e8] to-[#faf8f5] border-2 border-[#c8a882]/30">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center space-y-4">
                                                <div className="text-8xl">💇🏾‍♀️</div>
                                                <p className="text-[#3d4d3d] font-bold text-xl">Promise</p>
                                                <p className="text-[#c8a882] font-semibold text-sm">Founder & Hairstylist</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Stat Cards */}
                                    <div className="absolute -right-8 top-1/4 bg-white rounded-2xl p-4 shadow-2xl border-2 border-[#7d9b7a]/30">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-[#7d9b7a]">3+</p>
                                            <p className="text-xs font-bold text-[#3d4d3d]">Years Experience</p>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -left-8 bottom-1/3 bg-white rounded-2xl p-4 shadow-2xl border-2 border-[#c8a882]/30">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-[#c8a882]">100%</p>
                                            <p className="text-xs font-bold text-[#3d4d3d]">Natural</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border-2 border-[#c8a882]/40 shadow-sm mb-2">
                                    <span className="text-sm font-bold text-[#3d4d3d]">THE FOUNDER</span>
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl font-black text-[#3d4d3d] leading-tight">
                                    A Journey Born From <span className="text-[#7d9b7a]">Passion & Purpose</span>
                                </h2>

                                <div className="space-y-4 text-[#3d4d3d] text-lg leading-relaxed">
                                    <p>
                                        As a <span className="font-bold text-[#7d9b7a]">professional hairstylist and braider</span>, 
                                        Promise spent years working closely with clients, understanding their unique hair challenges, 
                                        and witnessing firsthand the frustration caused by harsh chemicals and ineffective products.
                                    </p>
                                    
                                    <p>
                                        <span className="font-bold text-[#c8a882]">"I saw a gap in the market,"</span> Promise recalls. 
                                        "My clients needed products that actually worked—products that were gentle, natural, and truly 
                                        effective for hair growth and quality. But nothing available met those standards."
                                    </p>
                                    
                                    <p>
                                        Driven by this realization, Promise embarked on an intensive journey of 
                                        <span className="font-bold text-[#7d9b7a]"> research and testing</span>. Working with natural 
                                        ingredients like avocado and rosemary, experimenting with formulations, and testing rigorously 
                                        on real hair concerns, the Promise collection was born.
                                    </p>

                                    <p className="font-bold text-xl text-[#3d4d3d] italic border-l-4 border-[#c8a882] pl-4">
                                        "Every product in this line represents my commitment to your hair's health and beauty. 
                                        This is more than a business—it's my promise to you."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#7d9b7a]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#c8a882]/5 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-[#c8a882]/10 px-5 py-2.5 rounded-full border-2 border-[#c8a882]/40 shadow-sm mb-4">
                                <span className="text-sm font-bold text-[#3d4d3d]">WHAT DRIVES US</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-[#3d4d3d] mb-4">
                                Our Mission & Values
                            </h2>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-[#7d9b7a] via-[#c8a882] to-[#7d9b7a] rounded-full mx-auto"></div>
                        </div>

                        {/* Values Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Value Card 1 */}
                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#f5f1e8] hover:to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-[#c8a882]/20 hover:border-[#7d9b7a]/40 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 bg-[#7d9b7a]/10 rounded-full blur-xl group-hover:bg-[#7d9b7a]/20 transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-[#7d9b7a]/20 to-[#c8a882]/20 group-hover:from-[#7d9b7a] group-hover:to-[#c8a882] p-6 rounded-full transition-all duration-500">
                                        <FaLeaf className="w-8 h-8 text-[#3d4d3d] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#3d4d3d] mb-3">100% Natural</h3>
                                <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                    We use only organic, plant-based ingredients. No harsh chemicals, no compromises—just pure, natural goodness.
                                </p>
                            </div>

                            {/* Value Card 2 */}
                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#f5f1e8] hover:to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-[#c8a882]/20 hover:border-[#7d9b7a]/40 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 bg-[#c8a882]/10 rounded-full blur-xl group-hover:bg-[#c8a882]/20 transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-[#c8a882]/20 to-[#7d9b7a]/20 group-hover:from-[#c8a882] group-hover:to-[#7d9b7a] p-6 rounded-full transition-all duration-500">
                                        <FaHeart className="w-8 h-8 text-[#3d4d3d] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#3d4d3d] mb-3">Made With Love</h3>
                                <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                    Every batch is crafted with care and attention. Your hair deserves products made with genuine passion.
                                </p>
                            </div>

                            {/* Value Card 3 */}
                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#f5f1e8] hover:to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-[#c8a882]/20 hover:border-[#7d9b7a]/40 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 bg-[#7d9b7a]/10 rounded-full blur-xl group-hover:bg-[#7d9b7a]/20 transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-[#7d9b7a]/20 to-[#c8a882]/20 group-hover:from-[#7d9b7a] group-hover:to-[#c8a882] p-6 rounded-full transition-all duration-500">
                                        <FaStar className="w-8 h-8 text-[#3d4d3d] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#3d4d3d] mb-3">Proven Results</h3>
                                <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                    Intensive research and testing ensure our products deliver real, visible results for hair growth and quality.
                                </p>
                            </div>

                            {/* Value Card 4 */}
                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#f5f1e8] hover:to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-[#c8a882]/20 hover:border-[#7d9b7a]/40 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 bg-[#c8a882]/10 rounded-full blur-xl group-hover:bg-[#c8a882]/20 transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-[#c8a882]/20 to-[#7d9b7a]/20 group-hover:from-[#c8a882] group-hover:to-[#7d9b7a] p-6 rounded-full transition-all duration-500">
                                        <GiChemicalDrop className="w-8 h-8 text-[#3d4d3d] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#3d4d3d] mb-3">Chemical-Free</h3>
                                <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                    No sulfates, parabens, or artificial additives. We believe in the power of nature, not laboratories.
                                </p>
                            </div>

                            {/* Value Card 5 */}
                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#f5f1e8] hover:to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-[#c8a882]/20 hover:border-[#7d9b7a]/40 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 bg-[#7d9b7a]/10 rounded-full blur-xl group-hover:bg-[#7d9b7a]/20 transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-[#7d9b7a]/20 to-[#c8a882]/20 group-hover:from-[#7d9b7a] group-hover:to-[#c8a882] p-6 rounded-full transition-all duration-500">
                                        <FaUsers className="w-8 h-8 text-[#3d4d3d] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#3d4d3d] mb-3">Community First</h3>
                                <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                    Built on real client feedback and needs. Your hair journey is our priority, always.
                                </p>
                            </div>

                            {/* Value Card 6 */}
                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#f5f1e8] hover:to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-[#c8a882]/20 hover:border-[#7d9b7a]/40 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative mb-6 inline-block">
                                    <div className="absolute inset-0 bg-[#c8a882]/10 rounded-full blur-xl group-hover:bg-[#c8a882]/20 transition-all duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-[#c8a882]/20 to-[#7d9b7a]/20 group-hover:from-[#c8a882] group-hover:to-[#7d9b7a] p-6 rounded-full transition-all duration-500">
                                        <FaLeaf className="w-8 h-8 text-[#3d4d3d] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#3d4d3d] mb-3">Eco-Conscious</h3>
                                <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                    Sustainable packaging and ethical practices. Beauty that's good for you and the planet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Process Section */}
            <section className="py-20 bg-gradient-to-br from-[#f5f1e8] via-white to-[#faf8f5] relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7d9b7a]/5 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border-2 border-[#c8a882]/40 shadow-sm mb-4">
                                <span className="text-sm font-bold text-[#3d4d3d]">HOW WE CREATE</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-[#3d4d3d] mb-4">
                                From Concept to Care
                            </h2>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-[#7d9b7a] via-[#c8a882] to-[#7d9b7a] rounded-full mx-auto mb-6"></div>
                            <p className="text-lg text-[#3d4d3d] font-medium max-w-2xl mx-auto">
                                Every Promise product goes through a rigorous journey before reaching your hair
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-[#7d9b7a] rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-black text-2xl">1</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-2 border-[#c8a882]/20">
                                    <h3 className="text-2xl font-black text-[#3d4d3d] mb-3">Research & Identification</h3>
                                    <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                        We identify common hair problems from real client experiences. Through consultations and feedback, 
                                        we understand what people truly need.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col md:flex-row gap-6 items-start md:ml-20">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-[#c8a882] rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-black text-2xl">2</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-2 border-[#7d9b7a]/20">
                                    <h3 className="text-2xl font-black text-[#3d4d3d] mb-3">Natural Ingredient Selection</h3>
                                    <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                        We source the finest organic ingredients like avocado oil and rosemary, known for their proven 
                                        benefits in hair growth, moisture, and strength.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col md:flex-row gap-6 items-start md:ml-40">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-[#7d9b7a] rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-black text-2xl">3</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-2 border-[#c8a882]/20">
                                    <h3 className="text-2xl font-black text-[#3d4d3d] mb-3">Formulation & Testing</h3>
                                    <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                        Intensive testing on various hair types and textures. We refine formulations until they deliver 
                                        consistent, visible results.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col md:flex-row gap-6 items-start md:ml-20">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-[#c8a882] rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-black text-2xl">4</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-2 border-[#7d9b7a]/20">
                                    <h3 className="text-2xl font-black text-[#3d4d3d] mb-3">Quality Assurance</h3>
                                    <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                        Every batch undergoes strict quality checks. We ensure purity, consistency, and effectiveness in 
                                        every bottle.
                                    </p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-[#7d9b7a] rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-black text-2xl">5</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-2 border-[#c8a882]/20">
                                    <h3 className="text-2xl font-black text-[#3d4d3d] mb-3">To Your Hair, With Love</h3>
                                    <p className="text-[#3d4d3d]/70 font-medium leading-relaxed">
                                        Packaged sustainably and delivered with care. Your hair transformation journey begins here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-10 right-10 w-72 h-72 bg-[#c8a882]/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#7d9b7a]/6 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-black text-[#3d4d3d] mb-6">
                            Ready to Transform Your <span className="text-[#7d9b7a]">Hair Journey</span>?
                        </h2>
                        <p className="text-lg text-[#3d4d3d] font-medium mb-8 max-w-2xl mx-auto">
                            Join thousands of happy customers who've discovered the power of truly natural hair care. 
                            Experience the Promise difference today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/shop" 
                                className="group bg-[#7d9b7a] hover:bg-[#5a6c5a] text-white font-bold text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <span>SHOP NOW</span>
                                <IoMdArrowForward className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
                            </a>
                            <a 
                                href="/contact" 
                                className="group bg-[#c8a882] hover:bg-[#b89872] text-white font-bold text-lg px-10 py-5 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <span>CONTACT US</span>
                            </a>
                        </div>

                        {/* Trust Stats */}
                        <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-black text-[#c8a882]">100%</p>
                                <p className="text-xs md:text-sm text-[#3d4d3d] font-bold uppercase">Natural</p>
                            </div>
                            <div className="w-px h-12 bg-[#c8a882]/30"></div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-black text-[#c8a882]">2025</p>
                                <p className="text-xs md:text-sm text-[#3d4d3d] font-bold uppercase">Est. Late 2025</p>
                            </div>
                            <div className="w-px h-12 bg-[#c8a882]/30"></div>
                           
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;