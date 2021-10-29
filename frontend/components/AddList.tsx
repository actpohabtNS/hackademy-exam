import { FocusEvent, useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ListHeadsContext } from '../context/listHeadsContext'
import { createList } from '../pages/api/lists'
 
type Props = {
  className?: string,
}

const defaultListName = "New List";

const AddList = ({ className } : Props) => {
  const [name, setName] = useState(defaultListName);
  const [isActive, setActive] = useState(false);
  const { state, dispatch } = useContext(ListHeadsContext);

  const handleBlur = (e: FocusEvent<HTMLDivElement, Element>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActive(false);
      setName("New List")
    }
  }

  const handleAddClick = () => {
    async function crList() {
      const listHead = await createList(name);
      dispatch({ type: "add", newListHead: { name, id: listHead.id } });
      setActive(false);
      setName(defaultListName);
    }
    crList();
  }

  return (
    <div
      className={`${isActive ? "bg-gray-100 text-gray-700" : "hover:bg-yellow-200"} w-full flex px-2 py-0.5 text-xl font-ns focus:outline-none cursor-pointer ${className}`}
      onFocus={() => setActive(true)}
      onBlur={(e) => handleBlur(e)}
      tabIndex={-1}
    >
      <FontAwesomeIcon
        icon={faPlus}
        size="sm"
        className="text-black mr-2 self-center"
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
          className="text-yellow-350 border-0 ml-2 hover:outline-none hover:text-yellow-500"
          onClick={handleAddClick}
        >
          Add
        </button>
      }
      
    </div>
  )
}

export default AddList;
