import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import AddList from "./AddList";
import SidebarBottom from "./SidebarBottom";
import { ListHeadsContext } from "../context/listHeadsContext";
import ListHead from "./ListHead";

const Sidebar = () => {
  const [isClosed, setClosed] = useState(false);
  const { state } = useContext(ListHeadsContext);

  return (
    <div className={`${isClosed ? "items-center" : "w-2/12 items-start "} h-screen p-4 bg-yellow-350 flex flex-col relative gap-y-3`}>
      <Image
        src="/img/logo-white.png"
        alt="openware logo"
        width={40}
        height={28}
      />
      <div
        className="py-1 p-2 cursor-pointer hover:text-gray-800"
        onClick={() => setClosed(!isClosed)}
      >
        <FontAwesomeIcon
          icon={isClosed ? faChevronRight : faChevronLeft}
          size="lg"
          className="mt-8"
        />
      </div>

      {
        state.listHeads &&
        state.listHeads.map(listHead => <ListHead
          listName={listHead.name}
          listId={listHead.id}
          key={listHead.id}
          closed={isClosed}
        />)
      }

      <AddList closed={isClosed} />

      <SidebarBottom
        className="text-xl mt-auto"
        vertical={isClosed}
      />
    </div>
  )
}

export default Sidebar;
