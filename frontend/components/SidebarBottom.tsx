import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faGlobeAmericas, faCog } from '@fortawesome/free-solid-svg-icons'

type Props = {
  className?: string,
}

const SidebarBottom = ({ className } : Props) => {
  return (
  <div className={`w-full box-border flex justify-around text-black ${className}`}>
       <FontAwesomeIcon
        icon={faSlidersH}
        className="cursor-pointer hover:text-gray-900"
       />

      <FontAwesomeIcon
        icon={faGlobeAmericas}
        className="cursor-pointer hover:text-gray-900"
       />

      <FontAwesomeIcon
        icon={faCog}
        className="cursor-pointer hover:text-gray-900"
       />
    </div>
  )
}

export default SidebarBottom;
