import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
 
type Props = {
  className?: string,
}

const AddList = ({ className } : Props) => {
  const [name, setName] = useState("New List")
  const [isActive, setActive] = useState(false)

  return (
    <div
      className={`${isActive ? "bg-gray-100 text-gray-700" : "hover:bg-yellow-200"} w-full flex px-2 py-0.5 text-xl font-ns focus:outline-none cursor-pointer ${className}`}
      onFocus={() => setActive(true)}
      onBlur={() => {setActive(false); setName("New List")}}
      tabIndex={-1}
    >
      <FontAwesomeIcon
        icon={faPlus}
        size="lg"
        className="text-xl text-black mr-2 self-center"
      />

      <input
        value={name}
        type="text"
        className={`${!isActive ? "cursor-pointer" : ""} flex-1 w-0 border-0 bg-transparent focus:outline-none`}
        onChange={(e) => setName(e.target.value)}
      />

      {
        isActive &&
        <button
          className="text-yellow-300 border-0 ml-2 hover:outline-none hover:text-yellow-500"
        >
          Add
        </button>
      }
      
    </div>
  )
}

export default AddList;
