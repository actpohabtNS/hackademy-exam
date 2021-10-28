import { list_T } from "../pages/api/taskTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import AddTask from "./AddTask";
import Task from "./Task";
import TodoBlock from "./ToDoBlock";
import { useState } from "react";

type Props = {
  className?: string,
  list: list_T,
}

const List = ({ className, list} : Props) => {
  const [completedClosed, setCompletedClosed] = useState(false);

  return (
    <div className={`px-4 overflow-y-scroll ${className}`}>
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

      {
        list.tasks.map(task => <Task task={task} completed={false} key={task.id} />)
      }

      {
        list.completed.length !== 0 &&
        <TodoBlock
          icon={completedClosed ? faChevronDown : faChevronUp}
          text="Completed"
          fadedText={list.completed.length.toString()}
          onBlockClick={() => setCompletedClosed(!completedClosed)}
          className="border-none"
          iconStyle="text-black"
        />
      }
      {
        !completedClosed &&
        list.completed.map(task => <Task task={task} completed={true} key={task.id} />)
      }

    </div>
  )
}

export default List;
