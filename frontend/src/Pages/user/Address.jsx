import { Link } from "react-router";

export default function Address() {
  return (
    <>
      <h2 className="text-base dark:text-[#c8dece]">The following addresses will be used on the checkout page by default.</h2>
      <h2 className="text-lg my-3 font-medium dark:text-[#f0f7f2]">Shipping Address</h2>

      <Link to='/account/address/edit' className="mb-3 text-base text-[#7c8c7d] hover:underline">Edit Shipping address</Link>
      <div className="flex flex-col gap-y-1">
        <div className="text-base dark:text-[#c8dece]">Mikayla Noble</div>
        <div className="text-base dark:text-[#c8dece]">you@example.com</div>
        <div className="text-base dark:text-[#c8dece]">1597 Sandown Rd</div>
        <div className="text-base dark:text-[#c8dece]">Limpopo</div>
        <div className="text-base dark:text-[#c8dece]">Durban</div>
        <div className="text-base dark:text-[#c8dece]">8191</div>
      </div>
    </>
  )
}
