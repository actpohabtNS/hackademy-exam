import { MouseEventHandler } from "react"

type Props = {
  type: "button" | "submit" | "reset" | undefined,
  text?: string,
  className?: string | undefined,
  onClick?: MouseEventHandler<HTMLButtonElement>,
}

const Button = ({ type, text, className, onClick } : Props) => {
  return (
    <button
      type={type}
      className={`text-lg font-roboto w-40 py-2 ${className}`}
      onClick={onClick}
    >
      { text }
    </button>
  )
}

export default Button
