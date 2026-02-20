import { Link, Outlet, useLocation } from "react-router-dom";

export default function UserNavbar() {

    const location = useLocation();

    const boxStyles = "h-14 flex border-b border-gray-300  items-center pl-8 hover:text-[#7c8c7d] duration-200"
     const navStyles = (path) =>
    `${location.pathname === path ? 'text-white bg-[#7c8c7d] hover:text-white' : ''}`;
  return (
    <section className="flex flex-col md:flex-row gap-y-5 md:gap-y-0 gap-x-4 py-16 w-11/12 mx-auto md:items-start">
        <div className="md:w-3/12 w-full border border-b-0 border-gray-300 rounded-sm md:self-start flex-shrink-0">
            <div className="h-20 flex border-b border-gray-300  items-center pl-8 gap-x-2">
                <div className="bg-gray-200 h-12 w-12 font-medium rounded-md flex items-center justify-center">LY</div>
                <div>
                    <div className="text-xs opacity-40">Welcome back,</div>
                    <p className="opacity-100">lypefexo</p>
                </div>
            </div>

            <Link to="/account" className={`${boxStyles} ${navStyles('/account')}`}>
                Dashboard
            </Link>
            <Link to="/account/orders" className={`${boxStyles} ${navStyles('/account/orders')}`}>
                Orders
            </Link>
            <Link to="/account/address" className={`${boxStyles} ${navStyles('/account/address')}`}>
                Addresses
            </Link>
            <Link to="/account/details" className={`${boxStyles} ${navStyles('/account/details')}`}>
                Account details
            </Link>
            <a href="#" className={boxStyles}>
                Log out
            </a>
        </div>
        <div className="md:w-8/12 w-full">
            <Outlet/>
        </div>
    </section>
  )
}