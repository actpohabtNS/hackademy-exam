import { MouseEvent } from 'react';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

import { task_T } from "../pages/api/taskTypes";
import TodoBlock from './TodoBlock';
import { MouseEventHandler, useContext } from 'react';
import { CurrListContext } from '../context/currListContext';
import { deleteTask, markTask } from '../pages/api/tasks';

type Props = {
  className?: string,
  task: task_T,
  completed: boolean,
  onClick?: MouseEventHandler<HTMLDivElement>,
}

const Task = ({ className, task, completed, onClick } : Props) => {
  const { state, dispatch } = useContext(CurrListContext);

  const handleIconClick = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
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
    <TodoBlock
      icon={completed ? faCheckCircle : faCircle}
      text={task.name}
      onBlockClick={onClick}
      onIconClick={handleIconClick}
      className={`${completed ? "line-through" : ""} ${className}`}
    />
  )
}

export default Task;
