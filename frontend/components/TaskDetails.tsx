import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faTrashAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

import { task_T } from "../pages/api/taskTypes";
import { useContext, useState } from 'react';
import { CurrListContext } from '../context/currListContext';
import React from 'react';
import { deleteTask, markTask, updateTask } from '../pages/api/tasks';

type Props = {
  className?: string,
  task: task_T,
  completed: boolean,
  selectTask: Function,
}

const TaskDetails = ({ className, task, selectTask, completed } : Props) => {
  const [ name, setName ] = useState(task.name);
  const [ description, setDescription ] = useState(task.description);

  const { state, dispatch } = useContext(CurrListContext);

  const handleRemove = () => {
    async function delTask() {
      const status = await deleteTask(state.list!.id, task.id);

      if (status === 204) {
        selectTask(null);
        dispatch({ type: 'remove_task', taskId: task.id });
      } else {
        console.error("Error removing task");
      }
    }
    delTask();
  }

  const handleUpdateTask = () => {
    async function updTask() {
      const updatedTask = { ...task, name, description };

      const status = await updateTask(state.list!.id, updatedTask, completed);
      if (status === 200) {
        dispatch({ type: 'update_task', updatedTask });
      } else {
        console.error("Error updating task");
      }
    }
    updTask();
  }

  const handleMarkTask = () => {
    async function marTask() {
      const status = await markTask(state.list!.id, task.id, !completed);

      if (status === 200) {
        dispatch({ type: `mark_${completed ? "in" : ""}completed`, taskId: task.id })
      } else {
        console.error("Error marking task");
      }
    }
    marTask();
  }

  return (
    <div className={`${className} relative w-1/5 h-full flex flex-col bg-yellow-350`}>
      <div className="flex-1 p-3">
        <div className="w-full flex justify-start items-center px-3 py-5 mb-3 bg-white">
          <FontAwesomeIcon
            icon={completed ? faCheckCircle : faCircle}
            size="lg"
            className="mr-3 text-yellow-350 cursor-pointer hover:text-gray-400"
            onClick={handleMarkTask}
          />

          <input
            value={name}
            type="text"
            className="w-full font-semibold text-xl border-none focus:outline-none"
            onChange={(e) => setName(e.target.value)}
            onBlur={handleUpdateTask}
          />
        </div>

        <textarea
          value={description}
          className="w-full p-4 text-lg resize-none focus:outline-none"
          placeholder="Description"
          name="task-desc"
          onChange={(e) => setDescription(e.target.value)}
          rows={7}
          onBlur={handleUpdateTask}
        >
          {task.description}
        </textarea>
      </div>

      <div className="flex justify-between items-center p-4 border-t-2 border-gray-400 mt-auto">
        <FontAwesomeIcon
          icon={faChevronRight}
          size="lg"
          className="cursor-pointer hover:text-gray-800"
          onClick={() => selectTask(null)}
        />
        <span className="text-lg text-center">
          Created on {new Date(task.createdAt).toLocaleDateString("en-US", { weekday: 'short', month: 'long', day: 'numeric' })}
        </span>
        <FontAwesomeIcon
          icon={faTrashAlt}
          size="lg"
          className="cursor-pointer hover:text-red-500"
          onClick={handleRemove}
        />
      </div>
    </div>
  )
}

React.memo(TaskDetails, (props : Props, nextProps : Props) => {
  return props.task.id === nextProps.task.id; // not update if lists id's are the same
});

export default TaskDetails;
