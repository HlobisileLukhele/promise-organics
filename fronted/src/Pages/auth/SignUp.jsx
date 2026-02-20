import { Link } from "react-router"

const SignUp = () => {
  return (
    <section className="flex flex-col items-center bg-[#ebecf1] justify-center md:h-screen h-svh">
      <div className="bg-white p-4 w-11/12 lg:w-1/3 mx-auto md:mx-0 h-auto rounded-md">
        <div className="text-center">
            <h2 className="md:text-6xl text-4xl title">Strawberyl</h2>
            <h4 className="text-2xl font-semibold my-3">Create an account</h4>
            <p className="">Join us for a better shopping experience</p>
        </div>
    

      <form className="mt-10">
         <label htmlFor="fullName" className="font-semibold opacity-70">Full Name</label>
         <input type="text" placeholder="John Doe" className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60" />

         <label htmlFor="email" className="font-semibold opacity-70">Email</label>
         <input type="email" placeholder="name@example.com" className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60" />

         <label htmlFor="password" className="font-semibold opacity-70">Password</label>
         <input type="password" placeholder=".........." className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60" />
         <button type="submit" className="my-2.5 w-full bg-[#7c8c7d] text-white font-semibold outline-none py-2 px-4 rounded-md transform duration-200 hover:bg-[#7c8c7d]/90 cursor-pointer">Create account</button>
      </form>
      <p className="text-center my-2.5">Already have an account? <Link to="/login" className="text-[#7c8c7d]">Sign in</Link></p>
    </div>
    </section>
  )
}

export default SignUp