const ResetPassword = () => {
  return (
    <section className="flex flex-col items-center bg-[#ebecf1]  justify-center md:h-screen h-svh">
      <div className="bg-white p-4  w-11/12 lg:w-1/3 mx-auto md:mx-0 h-auto rounded-md">
        <div className="text-center">
            <h4 className="text-3xl font-semibold my-3 title">Reset password</h4>
            <p className="">Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.</p>
        </div>

      <form action="" className="mt-10">

         <label htmlFor="password" className="font-semibold opacity-70">New Password</label>
          <input type="password" placeholder=".........." className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60" />

         <label htmlFor="confirmPassword" className="font-semibold opacity-70">Confirm New Password</label>
          <input type="password" placeholder=".........." className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60" />

         <button type="submit" className="my-2.5 w-full bg-[#7c8c7d] text-white font-semibold outline-none py-2 px-4 rounded-md transform duration-200 hover:bg-[#7c8c7d]/90 cursor-pointer">Reset Password</button>
      </form>
       </div>
    </section>
  )
}

export default ResetPassword