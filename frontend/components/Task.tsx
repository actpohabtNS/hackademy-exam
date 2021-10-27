import { task_T } from "../pages/api/taskTypes";

type Props = {
  className?: string,
  task: task_T
}

const Task = ({ className, task } : Props) => {
  return (
    <div className={` ${className}`}>

    </div>
  )
}

export default Task;
