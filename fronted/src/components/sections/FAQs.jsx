import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FAQs() {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    { 
      id: 1, 
      question: "What makes Promise Organics products truly organic?", 
      answer: "All Promise Organics products are made with 100% natural and certified organic ingredients. We use avocado oil, rosemary, and other botanical extracts with no synthetic chemicals, parabens, sulfates, or artificial fragrances. Our commitment to purity means what you see on the label is exactly what you get." 
    },
    { 
      id: 2, 
      question: "Are your products suitable for all hair types?", 
      answer: "Yes! Our organic formulas are designed to nourish and enhance all hair types and textures. Whether you have curly, straight, thick, thin, dry, or oily hair, our natural ingredients work harmoniously with your hair's unique needs to promote healthy growth and deep moisture." 
    },
    { 
      id: 3, 
      question: "How should I use Promise Organics haircare products?", 
      answer: "For best results, apply our products to damp hair. Massage gently into the scalp and work through to the ends. Our oils can be used as a pre-wash treatment or leave-in conditioner. Use 2-3 times per week for optimal nourishment. Each product comes with detailed usage instructions." 
    },
    { 
      id: 4, 
      question: "Are your products vegan and cruelty-free?", 
      answer: "Absolutely. Promise Organics is 100% vegan-friendly and cruelty-free. We never test on animals, and all our ingredients are plant-based. We believe in beauty that's kind to both you and the planet." 
    },
    { 
      id: 5, 
      question: "What is your approach to sustainable packaging?", 
      answer: "We're committed to eco-packaging. Our bottles are made from recyclable amber glass to protect the integrity of our organic ingredients, and our labels use biodegradable materials. We encourage customers to reuse or recycle our containers responsibly." 
    },
    { 
      id: 6, 
      question: "How long do your products last once opened?", 
      answer: "Our products contain no synthetic preservatives, so we recommend using them within 6-12 months of opening for maximum freshness and efficacy. Store in a cool, dry place away from direct sunlight to preserve the natural ingredients." 
    },
    { 
      id: 7, 
      question: "What is your return and refund policy?", 
      answer: "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, contact us within 30 days of delivery for a full refund or exchange. Products must be at least 50% full and in their original packaging. Customer satisfaction is our priority." 
    },
    { 
      id: 8, 
      question: "Do you ship internationally?", 
      answer: "Yes, we ship to select countries worldwide. Shipping costs and delivery times vary by location. Once your order is dispatched, you'll receive a tracking number via email. For international shipping inquiries, please contact our customer service team." 
    },
  ];

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-gradient-to-br from-stone-50 to-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 mt-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#8B9D83] to-transparent mb-2"></div>
        <p className="text-gray-600 text-sm">Everything you need to know about our organic haircare</p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={faq.id} 
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#8B9D83]/30 transition-all"
          >
            <button
              className="w-full flex justify-between items-center text-left p-5 focus:outline-none group"
              onClick={() => toggleFAQ(faq.id)}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8B9D83]/10 flex items-center justify-center text-[#8B9D83] text-sm font-semibold mt-0.5">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-800 text-base group-hover:text-[#8B9D83] transition-colors pr-4">
                  {faq.question}
                </span>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-[#8B9D83]/10 transition-colors">
                {openId === faq.id ? (
                  <FaChevronUp className="text-[#8B9D83] text-sm" />
                ) : (
                  <FaChevronDown className="text-[#8B9D83] text-sm" />
                )}
              </div>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-5 pl-14">
                <div className="w-full h-px bg-gradient-to-r from-gray-200 to-transparent mb-4"></div>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 p-6 bg-[#8B9D83]/5 rounded-2xl border border-[#8B9D83]/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#8B9D83]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Still have questions?</h3>
            <p className="text-gray-600 text-sm mb-3">
              Can't find the answer you're looking for? Our friendly customer service team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 text-[#8B9D83] font-medium text-sm hover:gap-3 transition-all"
            >
              <span>Contact us</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}