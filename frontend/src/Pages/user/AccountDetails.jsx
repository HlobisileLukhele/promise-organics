import InputField from "@/components/common/InputField";

export default function AccountDetails() {
  return (
    <>
       <form action="#" className="w-full">
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
            label="Display name"
            name="dname"
            type="text"
            placeholder="maggiejohn"
            required
          />
          <p className="text-sm italic">This will be how your name will be displayed in the account section and in reviews</p>
            <InputField
                label="Email address"
                name="email"
                type="email"
                placeholder="maggiejohn@gmail.com"
                required
            />

            <h2 className="text-xl font-medium">Password change</h2>
            <InputField
                label="Current password (leave blank to leave unchanged)"
                name="currentPassword"
                type="password"
            />
            <InputField
                label="New password (leave blank to leave unchanged)"
                name="newPassword"
                type="password"
            />
            <InputField
                label="Confirm new password"
                name="confirmNewPassword"
                type="password"
            />
          <button type="submit" className="mt-6 px-4 bg-[#7c8c7d] text-white font-medium py-3 cursor-pointer hover:opacity-90">
            Save changes
          </button>
      </form>
    </>
  )
}
