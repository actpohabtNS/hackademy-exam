import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import AddList from "./AddList";
import SidebarBottom from "./SidebarBottom";

const Sidebar = () => {
  return (
    <div className="w-2/12 h-screen p-4 bg-yellow-350 flex flex-col items-start relative">
      <Image
        src="/img/logo-white.png"
        alt="openware logo"
        width={40}
        height={28}
      />
      <FontAwesomeIcon
        icon={faChevronLeft}
        size="lg"
        className="mt-8 ml-2"
      />
      <AddList className="mt-2" />
      
      <SidebarBottom className="px-12 text-xl mt-auto" />
    </div>
  )
}

export default Sidebar;
