import { Link } from "react-router";

export default function Address() {
  return (
    <>
      <h2 className="text-base">The following addresses will be used on the checkout page by default.</h2>
      <h2 className="text-lg my-3 font-medium">Shipping Address</h2>

      <Link to='/account/address/edit' className="mb-3 text-base text-[#7c8c7d] hover:underline">Edit Shipping address</Link>
      <div className="flex flex-col gap-y-1">
        <div className="text-base">Mikayla Noble</div>
        <div className="text-base">you@example.com</div>
        <div className="text-base">1597 Sandown Rd</div>
        <div className="text-base">Limpopo</div>
        <div className="text-base">Durban</div>
        <div className="text-base">8191</div>
      </div>
    </>
  )
}
