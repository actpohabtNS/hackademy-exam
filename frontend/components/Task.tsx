import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

import { task_T } from "../pages/api/taskTypes";
import TodoBlock from './ToDoBlock';
import { useContext } from 'react';
import { CurrListContext } from '../context/currListContext';

type Props = {
  className?: string,
  task: task_T,
  completed: boolean,
}

const Task = ({ className, task, completed } : Props) => {
  const { dispatch } = useContext(CurrListContext);

  return (
    <TodoBlock
      icon={completed ? faCheckCircle : faCircle}
      text={task.name}
      onBlockClick={() => null}
      onIconClick={() => dispatch({ type: `mark_${completed ? "in" : ""}completed`, taskId: task.id })}
      className={`${completed ? "line-through" : ""} ${className}`}
    />
  )
}

export default Task;
