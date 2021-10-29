import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faGlobeAmericas, faCog } from '@fortawesome/free-solid-svg-icons'
import SidebarMoreMenu from './SidebarMoreMenu'
import { useState } from 'react'

type Props = {
  className?: string,
  vertical?: boolean,
}

const SidebarBottom = ({ className, vertical } : Props) => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
  <div className={`w-full box-border flex ${vertical ? "flex-col gap-y-6" : "px-12"} justify-around items-center text-black ${className}`}>
       <FontAwesomeIcon
        icon={faSlidersH}
        className="cursor-pointer hover:text-gray-800"
       />

      <FontAwesomeIcon
        icon={faGlobeAmericas}
        className="cursor-pointer hover:text-gray-800"
       />

      <div
        className="focus:outline-none"
        tabIndex={1000}
        onFocus={() => setMenuOpened(true)}
        onBlur={() => setMenuOpened(false)}
      >
        <FontAwesomeIcon
          icon={faCog}
          className="cursor-pointer hover:text-gray-800 focus:outline-none"
        />

        {
          menuOpened &&
          <SidebarMoreMenu
            className={`absolute bottom-12 transform ${vertical ? "-translate-x-4" : "-translate-x-20"}`}
          />
        }
      </div>
    </div>
  )
}

export default SidebarBottom;
