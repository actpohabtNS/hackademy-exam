import { ChangeEventHandler } from "react"

type Props = {
  value?: string,
  placeholder: string | undefined,
  type: string | (string & {}) | undefined,
  className?: string | undefined,
  onChange?: ChangeEventHandler<HTMLInputElement>,
}

const Input = ({ value, type, placeholder, className, onChange } : Props) => {
  return (
    <input
      value={value}
      type={type}
      placeholder={placeholder}
      className={`border-0 border-b border-gray-300 text-2xl placeholder-gray-300 focus:outline-none w-full font-ns ${ className }`}
      onChange={onChange}
    />
  )
}

export default Input
