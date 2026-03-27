import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUserStore } from "@/store/userStore";

const API = import.meta.env.VITE_API_URL || "";

export default function Address() {
  const { user, token } = useUserStore();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/billing`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBilling(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const hasAddress = billing && (billing.address || billing.city || billing.province || billing.postal_code);

  return (
    <>
      <h2 className="text-base dark:text-[#c8dece]">The following addresses will be used on the checkout page by default.</h2>
      <h2 className="text-lg my-3 font-medium dark:text-[#f0f7f2]">Shipping Address</h2>

      <Link to="/account/address/edit" className="mb-3 text-base text-[#7c8c7d] hover:underline">
        Edit Shipping address
      </Link>

      {loading ? (
        <p className="text-base dark:text-[#c8dece]">Loading…</p>
      ) : hasAddress ? (
        <div className="flex flex-col gap-y-1 mt-3">
          {user?.full_name && <div className="text-base dark:text-[#c8dece]">{user.full_name}</div>}
          {user?.email && <div className="text-base dark:text-[#c8dece]">{user.email}</div>}
          {billing.phone && <div className="text-base dark:text-[#c8dece]">{billing.phone}</div>}
          {billing.address && <div className="text-base dark:text-[#c8dece]">{billing.address}</div>}
          {billing.province && <div className="text-base dark:text-[#c8dece]">{billing.province}</div>}
          {billing.city && <div className="text-base dark:text-[#c8dece]">{billing.city}</div>}
          {billing.postal_code && <div className="text-base dark:text-[#c8dece]">{billing.postal_code}</div>}
        </div>
      ) : (
        <p className="text-base dark:text-[#c8dece] mt-3">No shipping address saved yet.</p>
      )}
    </>
  );
}
