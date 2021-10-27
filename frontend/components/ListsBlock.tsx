import { useContext } from "react";
import { CurrListContext } from "../context/currListContext";
import List from "./List";
import Navbar from "./Navbar";

const ListsBlock = () => {
  const { state: { list } } = useContext(CurrListContext);

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar />
      
      {
        list !== null
        ?
        <List 
          list={list}
        />
        :
        <div className="w-full flex-1 flex flex-col justify-center items-center font-medium">
          <span className="text-3xl text-yellow-350">
            List not found
          </span>

          <span className="text-2xl">
            We can&apos;t find the list you&apos;re looking for. Select one of your lists from the sidebar or create a new list.
          </span>
        </div>
      }

    </div>
  )
}

export default ListsBlock;
