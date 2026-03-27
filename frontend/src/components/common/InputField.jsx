import { useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

const InputField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
}) => {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type
  const inputProps = value !== undefined ? { value } : {}

  return (
    <div className="flex flex-col gap-2 my-4 w-full">
      <label htmlFor={name} className="text-sm font-medium dark:text-[#c8dece]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          {...inputProps}
          className={`px-4 py-2 border border-gray-300 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] outline-none focus-within:border-gray-500 dark:focus-within:border-[#7a9e85] rounded-xs w-full${isPassword ? ' pr-10' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#7a9e85] dark:hover:text-[#c8dece] transition-colors"
          >
            {showPw ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default InputField
