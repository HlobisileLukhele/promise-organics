import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export default function UserNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const nameParts = (user?.full_name || '').trim().split(' ');
  const initials = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : (nameParts[0]?.[0] || '?').toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const boxStyles = "h-14 flex border-b border-gray-300 dark:border-[#2d5a3d] items-center pl-8 hover:text-[#7c8c7d] duration-200 dark:text-[#c8dece]";
  const navStyles = (path) =>
    `${location.pathname === path ? 'text-white bg-[#7c8c7d] hover:text-white' : ''}`;

  return (
    <section className="flex flex-col md:flex-row gap-y-5 md:gap-y-0 gap-x-4 py-16 w-11/12 mx-auto md:items-start">
      <div className="md:w-3/12 w-full border border-b-0 border-gray-300 dark:border-[#2d5a3d] dark:bg-[#1e3d2a] rounded-sm md:self-start flex-shrink-0">
        <div className="h-20 flex border-b border-gray-300 dark:border-[#2d5a3d] items-center pl-8 gap-x-2">
          <div className="bg-[#7c8c7d] h-12 w-12 font-semibold text-white rounded-md flex items-center justify-center">
            {initials}
          </div>
          <div>
            <div className="text-xs opacity-40 dark:text-[#7a9e85] dark:opacity-100">Welcome back,</div>
            <p className="font-medium text-gray-800 dark:text-[#f0f7f2]">{user?.full_name || 'Guest'}</p>
          </div>
        </div>

        <Link to="/account" className={`${boxStyles} ${navStyles('/account')}`}>Dashboard</Link>
        <Link to="/account/orders" className={`${boxStyles} ${navStyles('/account/orders')}`}>Orders</Link>
        <Link to="/account/address" className={`${boxStyles} ${navStyles('/account/address')}`}>Addresses</Link>
        <Link to="/account/details" className={`${boxStyles} ${navStyles('/account/details')}`}>Account details</Link>
        <button onClick={handleLogout} className={`${boxStyles} w-full text-left text-red-500 hover:text-red-600`}>
          Log out
        </button>
      </div>

      <div className="md:w-8/12 w-full">
        <Outlet />
      </div>
    </section>
  );
}
