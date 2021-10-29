import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { CurrListContext } from '../context/currListContext'
import { createTask } from '../pages/api/tasks'
import TodoBlock from './TodoBlock'

type Props = {
  className?: string,
}

const AddTask = ({ className } : Props) => {
  const { state, dispatch } = useContext(CurrListContext);

  const handleAddTask = () => {
    async function creTask() {
      const newTask = await createTask(state.list!.id, `Item ${state.list?.tasks ? state.list?.tasks.length + 1 : 1}`, Date.now(), "");

      if (newTask) {
        dispatch({ type: "add_task", newTask })
      } else {
        console.error("Error creating task");
      }
    }
    creTask();
  }

  return (
    <TodoBlock
      icon={faPlus}
      text="Add a task"
      onBlockClick={handleAddTask}
      className={`text-yellow-350 ${className}`}
    />
  )
}

export default AddTask;
