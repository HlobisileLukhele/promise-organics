import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import InputField from "@/components/common/InputField";
import { useUserStore } from "@/store/userStore";
import { apiFetch } from "@/utils/api";

const API = import.meta.env.VITE_API_URL || "";

export default function EditAddress() {
  const { token } = useUserStore();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    address: "",
    city: "",
    province: "",
    postal_code: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/billing`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const { address, city, province, postal_code, phone } = data.data;
          setFields({
            address: address ?? "",
            city: city ?? "",
            province: province ?? "",
            postal_code: postal_code ?? "",
            phone: phone ?? "",
          });
        }
      })
      .catch(() => {});
  }, [token]);

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(`${API}/api/billing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/account/address");
      } else {
        setError(data.message || "Failed to save address.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <h2 className="text-xl font-medium my-5 dark:text-[#f0f7f2]">Shipping details</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <InputField
          label="Phone"
          name="phone"
          type="text"
          placeholder="085 283 8553"
          value={fields.phone}
          onChange={handleChange}
        />
        <InputField
          label="Province"
          name="province"
          type="text"
          placeholder="Limpopo"
          value={fields.province}
          onChange={handleChange}
          required
        />
        <InputField
          label="Street Address"
          name="address"
          type="text"
          placeholder="1597 Sandown Rd"
          value={fields.address}
          onChange={handleChange}
          required
        />
        <InputField
          label="Town / City"
          name="city"
          type="text"
          placeholder="Durban"
          value={fields.city}
          onChange={handleChange}
          required
        />
        <InputField
          label="Postcode / ZIP"
          name="postal_code"
          type="text"
          placeholder="8191"
          value={fields.postal_code}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={saving}
          className="md:w-1/6 w-full bg-[#7c8c7d] text-white font-medium py-3 cursor-pointer hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save address"}
        </button>
      </form>
    </>
  );
}
