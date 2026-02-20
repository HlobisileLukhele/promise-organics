import { Link } from "react-router"

const SignIn = () => {
  return (
    <section className="flex flex-col items-center bg-[#ebecf1]  justify-center md:h-screen h-svh">
      <div className="bg-white p-4  w-11/12 lg:w-1/3 mx-auto md:mx-0 h-auto rounded-md">
        <div className="text-center">
            <h4 className="text-3xl font-semibold my-3 title">Welcome back</h4>
            <p className="">Sign in to your Strawberyl account</p>
        </div>

      <form action="" className="mt-10">

         <label htmlFor="email" className="font-semibold opacity-70">Email</label>
         <input type="email" placeholder="name@example.com" className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60" />

         <div className="flex items-center justify-between">
            <label htmlFor="password" className="font-semibold opacity-70">Password</label>
            <Link to="/forgot-password" className="text-[#7c8c7d] text-sm hover:underline">Forgot Password?</Link>
         </div>
         <input type="password" placeholder=".........." className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60" />

         <button type="submit" className="my-2.5 w-full bg-[#7c8c7d] text-white font-semibold outline-none py-2 px-4 rounded-md transform duration-200 hover:bg-[#7c8c7d]/90 cursor-pointer">Login</button>
      </form>
      <p className="text-center my-2.5">Don't have an account? <Link to="/register" className="text-[#7c8c7d]">Create an account</Link></p>
       </div>
    </section>
  )
}

export default SignIn