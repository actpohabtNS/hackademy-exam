import { MouseEvent, useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { ListHeadsContext } from '../context/listHeadsContext'
import { CurrListContext } from '../context/currListContext'
 
type Props = {
  className?: string,
  listName: string,
  listId: number,
}

const ListHead = ({ className, listName, listId } : Props) => {
  const [isHovered, setHovered] = useState(false);
  const { dispatch: dispatchListHead } = useContext(ListHeadsContext);
  const { state: { list: currList }, dispatch: dispatchCurrList } = useContext(CurrListContext);

  const handleRemoveList = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    dispatchListHead({ type: "delete", listHeadId: listId });
    dispatchCurrList({ type: "remove" });
  }

  return (
    <div
      className={
        `${ (currList && listId === currList.id) ? "bg-yellow-100" : "" }
        text-black w-full flex px-2 py-0.5 text-xl font-ns focus:outline-none cursor-pointer hover:bg-yellow-100
        ${className}`
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => dispatchCurrList({ type: "set", listId })}
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
          onClick={e => handleRemoveList(e)}
        />
      }
      
    </div>
  )
}

export default ListHead;
