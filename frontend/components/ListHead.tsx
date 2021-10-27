import { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { ListHeadsContext } from '../context/listHeadsContext'
 
type Props = {
  className?: string,
  listName: string,
  listId: number,
}

const ListHead = ({ className, listName, listId } : Props) => {
  const [isHovered, setHovered] = useState(false);
  const { dispatch } = useContext(ListHeadsContext);

  return (
    <div
      className={`text-black w-full flex px-2 py-0.5 text-xl font-ns focus:outline-none cursor-pointer hover:bg-yellow-100 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FontAwesomeIcon
        icon={faListUl}
        size="sm"
        className="text-black mr-2 self-center"
      />

      <span className="inline-block flex-1">
        {listName}
      </span>

      {
        isHovered &&
        <FontAwesomeIcon
          icon={faTrashAlt}
          size="sm"
          className="text-gray-600 mr-2 self-center hover:text-red-500"
          onClick={() => dispatch({type: "delete", listHeadId: listId})}
        />
      }
      
    </div>
  )
}

export default ListHead;
