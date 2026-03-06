import ContactInfo from "@/components/sections/ContactInfo";
import ContactForm from "@/components/sections/ContactForm";
import FAQs from "@/components/sections/FAQs";

export default function Contact() {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#c8937b] text-center mb-4">Get in Touch with Us</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-12 mt-20">
        <ContactInfo />
        <ContactForm />
      </div>

      <FAQs />
    </div>
  );
}
