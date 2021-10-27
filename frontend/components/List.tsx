import { list_T } from "../pages/api/taskTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import AddTask from "./AddTask";

type Props = {
  className?: string,
  list: list_T,
}

const List = ({ className, list} : Props) => {
  return (
    <div className={`px-4 ${className}`}>
      <div className="pt-7 pb-2 flex justify-start items-center">
        <span className="text-2xl font-bold mr-4">
          {list.name}
        </span>

        <FontAwesomeIcon
          icon={faEllipsisH}
          size="lg"
          className="hover:text-gray-700 cursor-pointer"
        />
      </div>

      <AddTask /> 

    </div>
  )
}

export default List;
