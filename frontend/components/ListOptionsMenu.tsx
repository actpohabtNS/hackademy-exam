import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faICursor, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import TodoBlock from "./ToDoBlock";
import { useContext } from 'react';
import { ListHeadsContext } from '../context/listHeadsContext';
import { CurrListContext } from '../context/currListContext';

type Props = {
  className?: string,
  listId: number,
}

const ListOptionsMenu = ({ className, listId } : Props) => {
  const { dispatch: listHeadsDispatch } = useContext(ListHeadsContext);
  const { dispatch: currListDispatch } = useContext(CurrListContext);

  const handleRemoveClick = () => {
    listHeadsDispatch({ type: 'delete', listHeadId: listId });
    currListDispatch({ type: 'remove' });
  }

  return (
    <div className={`${className} absolute bg-white rounded-md flex flex-col text-black font-semibold filter drop-shadow-xl`}>
      <div className="flex-1 flex justify-center border-b-2 border-gray-300 text-xl py-4">
        List options
      </div>

      <div className="hover:bg-gray-100 px-6 pr-10 py-4 border-b-2 border-gray-300 cursor-pointer">
        <FontAwesomeIcon
          icon={faICursor}
          size="lg"
          className="filter hover:drop-shadow-lg mr-4"
        />
        <span className="text-xl">
          Rename list
        </span>
      </div>

      <div
        className="hover:bg-gray-100 px-6 pr-10 py-4 rounded-md cursor-pointer hover:text-red-500"
        onClick={handleRemoveClick}
      >
        <FontAwesomeIcon
          icon={faTrashAlt}
          size="lg"
          className="filter hover:drop-shadow-lg mr-4"
        />
        <span className="text-xl">
          Delete list
        </span>
      </div>
    </div>
  )
}

export default ListOptionsMenu;
