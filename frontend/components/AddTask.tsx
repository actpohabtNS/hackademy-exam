import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { CurrListContext } from '../context/currListContext'
import { task_T } from '../pages/api/taskTypes'
import TodoBlock from './ToDoBlock'

type Props = {
  className?: string,
}

const AddTask = ({ className } : Props) => {
  const { state, dispatch } = useContext(CurrListContext);

  const createTask = () : task_T => {
    return {
      name: `Item ${state.list?.tasks.length! + 1}`,
      id: Date.now(),
      createdAt: new Date(Date.now()),
      description: ""
    }
  }

  return (
    <TodoBlock
      icon={faPlus}
      text="Add a task"
      onBlockClick={() => dispatch({ type: "add_task", newTask: createTask() })}
      className={`text-yellow-350 ${className}`}
    />
  )
}

export default AddTask;
