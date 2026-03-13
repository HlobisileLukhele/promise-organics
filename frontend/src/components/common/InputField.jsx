const InputField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  onChange,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-2 my-4 w-full">
      <label
        htmlFor={name}
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className="px-4 py-2 border border-gray-300 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] outline-none focus-within:border-gray-500 dark:focus-within:border-[#7a9e85] rounded-xs"
      />
    </div>
  );
};

export default InputField;
