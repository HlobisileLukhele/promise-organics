import { useForm } from "react-hook-form";

export default function ContactForm() {
  // Handle form input errors
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="w-full md:w-1/2 bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100">
      {/* Header with decorative element */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Get In Touch</h2>
        </div>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#8B9D83] to-transparent"></div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Name input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            className="w-full px-5 py-3.5 rounded-full border border-gray-300 bg-stone-50 focus:outline-none focus:border-[#8B9D83] focus:ring-2 focus:ring-[#8B9D83]/20 transition-all placeholder:text-gray-400"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-rose-500 text-sm mt-2 ml-4">{errors.name.message}</p>
          )}
        </div>

        {/* Email input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            className="w-full px-5 py-3.5 rounded-full border border-gray-300 bg-stone-50 focus:outline-none focus:border-[#8B9D83] focus:ring-2 focus:ring-[#8B9D83]/20 transition-all placeholder:text-gray-400"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-rose-500 text-sm mt-2 ml-4">{errors.email.message}</p>
          )}
        </div>

        {/* Message input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            rows="5"
            placeholder="Tell us how we can help you..."
            className="w-full px-5 py-3.5 rounded-3xl border border-gray-300 bg-stone-50 focus:outline-none focus:border-[#8B9D83] focus:ring-2 focus:ring-[#8B9D83]/20 transition-all resize-none placeholder:text-gray-400"
            {...register("message", { required: "Please enter a message" })}
          ></textarea>
          {errors.message && (
            <p className="text-rose-500 text-sm mt-2 ml-4">{errors.message.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-[#8B9D83] text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-[#7a8c72] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          <span>Send Message</span>
          <svg 
            className="w-5 h-5 transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Optional: Success message area */}
        <p className="text-sm text-gray-500 text-center mt-4">
          We'll get back to you within 24 hours
        </p>
      </form>
    </div>
  );
}