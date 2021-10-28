import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import TodoBlock from "./ToDoBlock";

type Props = {
  className?: string,
}

const SidebarMoreMenu = ({ className } : Props) => {
  return (
    <div className={`${className} bg-white rounded-md flex flex-col cursor-pointer text-gray-400 font-semibold filter drop-shadow-xl`}>
      <div className="hover:bg-gray-100 px-6 pr-20 py-4 rounded-md">
        <FontAwesomeIcon
          icon={faUserCircle}
          size="lg"
          className="filter hover:drop-shadow-lg mr-4"
        />
        <span className="text-gray-500 text-xl hover:text-gray-600">
          Account
        </span>
      </div>

      <div className="hover:bg-gray-100 px-6 pr-20 py-4 rounded-md">
        <FontAwesomeIcon
          icon={faSignOutAlt}
          size="lg"
          className="filter hover:drop-shadow-lg mr-4"
        />
        <span className="text-gray-500 text-xl hover:text-gray-600">
          Log Out
        </span>
      </div>
    </div>
  )
}

export default SidebarMoreMenu;
