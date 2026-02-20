import InputField from "@/components/common/InputField";

export default function EditAddress() {
  return (
    <>
         <form action="#" className="flex flex-col w-full">
          <h2 className="text-xl font-medium my-5">Shipping details</h2>

          <InputField
            label="First name"
            name="fname"
            type="text"
            placeholder="John"
            required
          />
          <InputField
            label="Last name"
            name="lname"
            type="text"
            placeholder="Maggie"
            required
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <InputField
            label="Phone"
            name="phone"
            type="text"
            placeholder="085 283 8553"
            required
          />
          <InputField
            label="Province"
            name="province"
            type="text"
            placeholder="Limpopo"
            required
          />
          <InputField
            label="Street Address"
            name="address"
            type="text"
            placeholder="1597 Sandown Rd"
            required
          />
          <InputField
            label="Town / City"
            name="town"
            type="text"
            placeholder="Durban"
            required
          />
          <InputField
            label="Postcode /ZIP"
            name="postcode"
            type="text"
            placeholder="8191"
            required
          />
         
          <button type="submit" className="md:w-1/6 w-full bg-[#7c8c7d] text-white font-medium py-3 cursor-pointer hover:opacity-90">
            Save address
          </button>
      </form>
    </>
  )
}
