import { MouseEvent } from 'react';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

import { task_T } from "../pages/api/taskTypes";
import TodoBlock from './ToDoBlock';
import { MouseEventHandler, useContext } from 'react';
import { CurrListContext } from '../context/currListContext';

type Props = {
  className?: string,
  task: task_T,
  completed: boolean,
  onClick?: MouseEventHandler<HTMLDivElement>,
}

const Task = ({ className, task, completed, onClick } : Props) => {
  const { dispatch } = useContext(CurrListContext);

  const handleIconClick = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    dispatch({ type: `mark_${completed ? "in" : ""}completed`, taskId: task.id })
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
