import { useContext, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import AddList from "./AddList";
import SidebarBottom from "./SidebarBottom";
import { ListHeadsContext } from "../context/listHeadsContext";
import ListHead from "./ListHead";
import { loadListHeads } from "../pages/api/lists";

const Sidebar = () => {
  const { state, dispatch } = useContext(ListHeadsContext);

  // component did mount
  useEffect(() => {
    async function fetchData() {
      const listHeads = await loadListHeads();
      dispatch({ type: 'set', listHeads })
    }
    fetchData();
  }, [dispatch]);

  return (
    <div className="w-2/12 h-screen p-4 bg-yellow-350 flex flex-col items-start relative gap-y-3">
      <Image
        src="/img/logo-white.png"
        alt="openware logo"
        width={40}
        height={28}
      />
      <div className="py-1">
        <FontAwesomeIcon
          icon={faChevronLeft}
          size="lg"
          className="mt-8 ml-2"
        />
      </div>

      {
        state.listHeads &&
        state.listHeads.map(listHead => <ListHead
          listName={listHead.name}
          listId={listHead.id}
          key={listHead.id}
        />)
      }

      <AddList />

      <SidebarBottom className="px-12 text-xl mt-auto" />
    </div>
  )
}

export default Sidebar;
