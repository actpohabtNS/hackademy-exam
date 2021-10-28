import { list_T, task_T } from "../pages/api/taskTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import AddTask from "./AddTask";
import Task from "./Task";
import TodoBlock from "./ToDoBlock";
import { useState } from "react";
import TaskDetails from "./TaskDetails";
import React from "react";

type Props = {
  className?: string,
  list: list_T,
}

const List = ({ className, list} : Props) => {
  const [completedClosed, setCompletedClosed] = useState(false);
  const [selectedTask, selectTask] = useState<task_T | null>(null);

  const idsAreEqual = (task1 : task_T | null, task2 : task_T | null) => {
    if (!task1 || !task2) {
      return false;
    }
    return task1.id === task2.id;
  }

  return (
    <div className={`flex overflow-y-auto h-full ${className}`}>
      <div className="px-4 flex-1 relative">
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
          list.tasks.map(task => <Task
            task={task}
            completed={false}
            key={task.id}
            onClick={() => selectTask(idsAreEqual(task, selectedTask) ? null : task)}
            className={`${idsAreEqual(task, selectedTask) ? "bg-yellow-50 hover:bg-yellow-50" : ""}`}
          />)
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
          list.completed.map(task => <Task
            task={task}
            completed={true}
            key={task.id} 
            onClick={() => selectTask(idsAreEqual(task, selectedTask) ? null : task)}
            className={`${idsAreEqual(task, selectedTask) ? "bg-yellow-50 hover:bg-yellow-50" : ""}`}
          />)
        }
      </div>

      {
        selectedTask &&
        (list.tasks.find(task => task.id === selectedTask.id) || list.completed.find(task => task.id === selectedTask.id)) &&
        <TaskDetails
          task={selectedTask}
          completed={list.completed.findIndex(task => task.id === selectedTask.id) !== -1}
          className="relative right-0"
          key={selectedTask.id}
          selectTask={selectTask}
        />
      }

    </div>
  )
}

export default List;
